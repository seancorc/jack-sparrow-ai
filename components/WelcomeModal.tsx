'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function WelcomeModal({ onStart }: { onStart: () => void }) {
  const [isOpen, setIsOpen] = useState(true)

  const handleStart = () => {
    setIsOpen(false)
    onStart()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        console
        setIsOpen(open);
        if (!open) handleStart();
      }}>
      <DialogContent className="sm:max-w-[425px] bg-yellow-100 border-4 border-yellow-800">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-yellow-800">Ahoy, Matey!</DialogTitle>
          <DialogDescription className="text-lg text-yellow-900">
            Welcome aboard the Black Pearl! Are ye ready for an adventure with Captain Jack Sparrow?
          </DialogDescription>
        </DialogHeader>
        <Button onClick={handleStart} className="bg-yellow-800 hover:bg-yellow-900 text-white">
          Aye, let's set sail!
        </Button>
      </DialogContent>
    </Dialog>
  )
}

