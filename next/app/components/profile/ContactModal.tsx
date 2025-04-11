'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'contact' | 'quote';
  title: string;
  entityName: string;
  productName?: string;
}

export default function ContactModal({
  isOpen,
  onOpenChange,
  type,
  title,
  entityName,
  productName
}: ContactModalProps) {
  const isQuoteRequest = type === 'quote';
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white border-0 rounded-lg shadow-lg p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-emerald-700">{title}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {isQuoteRequest 
              ? `Get a quotation for ${productName} from ${entityName}.` 
              : `Send a message to ${entityName}${productName ? ` about ${productName}` : ''}.`}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-gray-700 font-medium">
                Your Email
              </Label>
              <Input 
                id="contact-email" 
                type="email" 
                placeholder="example@email.com" 
                className="w-full border border-gray-200 rounded-md text-sm" 
              />
            </div>
            
            {isQuoteRequest && (
              <div className="space-y-2">
                <Label htmlFor="quote-quantity" className="text-gray-700 font-medium">
                  Quantity
                </Label>
                <Input 
                  id="quote-quantity" 
                  type="number" 
                  placeholder="Enter quantity" 
                  className="w-full border border-gray-200 rounded-md text-sm" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700 font-medium">
                {isQuoteRequest ? "Additional Requirements" : "Message"}
              </Label>
              <Textarea 
                id="message" 
                placeholder={isQuoteRequest ? "Describe your requirements..." : "Enter your message here..."} 
                className="w-full border border-gray-200 rounded-md text-sm min-h-[120px]" 
              />
            </div>
          </div>
        </div>
        <DialogFooter className="px-6 py-4 bg-gray-50 flex flex-row justify-end gap-3">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isQuoteRequest ? "Submit Request" : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 