"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

type Faq = {
  question: string;
  answer: string;
};

export function FaqList({ items }: { items: ReadonlyArray<Faq> }) {
  return (
    <Accordion.Root className="grid gap-3" collapsible type="single">
      {items.map((item, index) => (
        <Accordion.Item className="futuristic-panel border border-[var(--border)] bg-[rgba(255,209,102,0.045)]" key={item.question} value={`faq-${index}`}>
          <Accordion.Header>
            <Accordion.Trigger className="focus-ring flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-bold">
              {item.question}
              <ChevronDown aria-hidden className="h-4 w-4 shrink-0 transition data-[state=open]:rotate-180" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden px-5 pb-5 text-sm leading-6 text-[var(--muted)] data-[state=closed]:animate-none">
            {item.answer}
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
