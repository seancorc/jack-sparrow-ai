'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skull } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function VoiceChat({ pauseMusicForChat }: { pauseMusicForChat: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [buttonState, setButtonState] = useState<'initial' | 'listening' | 'speaking' | 'reply'>('initial')
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.log("SpeechRecognition is supported");
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
      }
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        // Set up event handlers
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const interimTranscript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(interimTranscript);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          setButtonState('initial');
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcript) {
            setButtonState('speaking');
          } else {
            setButtonState('initial');
          }
        };
      } else {
        console.warn("SpeechRecognition is not supported in this browser");
      }
    } else {
      console.warn("SpeechRecognition is not supported in this browser");
    }
  }, []); // No dependencies, runs once on mount

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const fetchAIResponse = useCallback(async (input: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: input }],
      }),
    });

    // Log the raw response text
    const text = await response.text();
    console.log("Raw response:", text);

    // Handle plain text response
    return text;
  }, []);

  const speak = useCallback((text: string) => {
    console.log('speaking', text)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9 // Slightly slower rate
      utterance.pitch = 0.9 // Slightly lower pitch

      let voices = window.speechSynthesis.getVoices()
      const maleVoice = voices.find(voice => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male'))
      
      if (maleVoice) {
        utterance.voice = maleVoice
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        setButtonState('speaking')
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setButtonState('reply')
      }

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance)
      var r = setInterval(function () {
        console.log(window.speechSynthesis.speaking);
        if (!window.speechSynthesis.speaking) clearInterval(r);
        else window.speechSynthesis.resume();
    }, 14000);
    }
  }, [])

  const startListening = useCallback((e: React.PointerEvent) => {
    pauseMusicForChat()
    if (!recognitionRef.current) {
      alert("Sorry, your browser doesn't support SpeechRecognition.");
      return;
    }
    e.preventDefault();
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
    recognitionRef.current.start()
    setIsListening(true)
    setTranscript('')
    setButtonState('listening')
  }, [isSpeaking])

  const stopListening = useCallback(async (e: React.PointerEvent) => {
    e.preventDefault();
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      if (transcript) {
        setMessages(prev => [...prev, { role: 'user', content: transcript }])
        const response = await fetchAIResponse(transcript)
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
        speak(response)
      } else {
        setButtonState('initial')
      }
    }
  }, [transcript, fetchAIResponse, speak, setMessages, setIsListening, setButtonState])

  const getButtonText = () => {
    switch (buttonState) {
      case 'initial':
        return 'Press & say hi to Jack'
      case 'listening':
        return 'Listening...'
      case 'speaking':
        return 'Press to interrupt'
      case 'reply':
        return 'Press to reply'
      default:
        return 'Press & say hi to Jack'
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="text-black text-center mb-4 text-lg font-bold">
        {getButtonText()}
      </div>
      <Button
        className={`w-32 h-32 rounded-full mb-8 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
        onPointerDown={startListening}
        onPointerUp={stopListening}
      >
        <Skull className="w-16 h-16 text-black" />
      </Button>
      <ScrollArea className="h-[300px] w-full rounded-md border p-4 bg-black bg-opacity-50" ref={scrollAreaRef}>
        {messages.map((m, index) => (
          <div
            key={index}
            className={`mb-4 ${
              m.role === 'user' ? 'text-blue-400' : 'text-yellow-400'
            }`}
          >
            <span className="font-bold">{m.role === 'user' ? 'You: ' : 'Jack Sparrow: '}</span>
            {m.content}
          </div>
        ))}
        {isListening && transcript && (
          <div className="text-green-400">
            <span className="font-bold">You (live): </span>
            {transcript}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

