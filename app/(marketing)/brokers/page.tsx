import type { Metadata } from "next";
import { BrokerListSection } from "@/components/marketing/broker-list";

export const metadata: Metadata = {
  title: "Broker Signup"
};

export default function BrokersPage() {
  return <BrokerListSection />;
}
