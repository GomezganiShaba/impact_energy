import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Inquiry } from "@prisma/client";

interface StatusUpdateEmailProps {
  inquiry: Inquiry;
  customMessage?: string;
}

export default function StatusUpdateEmail({
  inquiry,
  customMessage,
}: StatusUpdateEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>An update on your quote request, Impact Energy Solution</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={headerStyle}>
            <Heading style={headingStyle}>Impact Energy Solution</Heading>
          </Section>
          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              Update on your request
            </Heading>
            <Text style={textStyle}>Hi {inquiry.name},</Text>
            <Text style={textStyle}>
              {customMessage ||
                `We have reviewed your request for ${inquiry.service} and have prepared a quote for you. Please call us to discuss the details.`}
            </Text>
            <Text style={phoneStyle}>+265 881 682 589</Text>
            <Text style={textStyle}>
              Steve Khomba, Co-founder and Director of Marketing and Business
              Development, Impact Energy Solution.
            </Text>
          </Section>
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Lilongwe Area 23 and Area 49, Malawi. MERA licensed.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const bodyStyle = { backgroundColor: "#0E2318", fontFamily: "Arial, sans-serif", margin: "0", padding: "32px 0" };
const containerStyle = { maxWidth: "600px", margin: "0 auto", backgroundColor: "#F6E79A", borderRadius: "12px", overflow: "hidden" as const };
const headerStyle = { backgroundColor: "#163A28", padding: "24px 32px" };
const headingStyle = { color: "#FBE98F", fontSize: "22px", margin: "0" };
const contentStyle = { padding: "32px" };
const h2Style = { color: "#0E2318", fontSize: "20px", marginTop: "0" };
const textStyle = { color: "#0E2318", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px 0" };
const phoneStyle = { color: "#163A28", fontSize: "20px", fontWeight: "bold", margin: "8px 0 16px 0" };
const footerStyle = { backgroundColor: "#08170F", padding: "16px 32px" };
const footerTextStyle = { color: "#FBE98F", fontSize: "12px", margin: "0", opacity: 0.7 };
