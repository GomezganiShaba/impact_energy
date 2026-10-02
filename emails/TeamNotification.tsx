import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Inquiry } from "@prisma/client";

interface TeamNotificationEmailProps {
  inquiry: Inquiry;
  adminUrl: string;
  waNumber: string;
}

export default function TeamNotificationEmail({
  inquiry,
  adminUrl,
  waNumber,
}: TeamNotificationEmailProps) {
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hi ${inquiry.name}, I'm following up on your quote request for ${inquiry.service}.`
  )}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>New quote request: {inquiry.service} ({inquiry.location})</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Heading style={headingStyle}>Impact Energy Solution</Heading>
            <Text style={subHeadingStyle}>New Quote Request</Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              {inquiry.service}
            </Heading>
            <Text style={labelStyle}>CUSTOMER DETAILS</Text>

            <table style={tableStyle}>
              <tbody>
                <Row label="Name" value={inquiry.name} />
                <Row label="Phone" value={inquiry.phone} />
                {inquiry.email && <Row label="Email" value={inquiry.email} />}
                <Row label="Service" value={inquiry.service} />
                <Row label="Location" value={inquiry.location} />
                <Row label="Property type" value={inquiry.propertyType} />
                {inquiry.message && <Row label="Message" value={inquiry.message} />}
                <Row label="Submitted" value={new Date(inquiry.createdAt).toLocaleString("en-MW", { timeZone: "Africa/Blantyre" })} />
              </tbody>
            </table>

            <Hr style={hrStyle} />

            <Text style={labelStyle}>QUICK ACTIONS</Text>

            <Section style={{ marginBottom: "16px" }}>
              <Link href={`tel:${inquiry.phone}`} style={actionLinkStyle}>
                Call {inquiry.phone}
              </Link>
            </Section>

            <Section style={{ marginBottom: "16px" }}>
              <Link href={waUrl} style={actionLinkStyle}>
                WhatsApp {inquiry.phone}
              </Link>
            </Section>

            <Button style={buttonStyle} href={adminUrl}>
              View in admin panel
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Impact Energy Solution, Lilongwe Area 23 and Area 49, Malawi.
            </Text>
            <Text style={footerTextStyle}>MERA licensed. Registered with the Registrar of Companies.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td style={tdLabelStyle}>{label}</td>
      <td style={tdValueStyle}>{value}</td>
    </tr>
  );
}

// Styles
const bodyStyle = {
  backgroundColor: "#0E2318",
  fontFamily: "Arial, sans-serif",
  margin: "0",
  padding: "32px 0",
};

const containerStyle = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#F6E79A",
  borderRadius: "12px",
  overflow: "hidden" as const,
};

const headerStyle = {
  backgroundColor: "#163A28",
  padding: "24px 32px",
};

const headingStyle = {
  color: "#FBE98F",
  fontSize: "22px",
  margin: "0 0 4px 0",
};

const subHeadingStyle = {
  color: "#F2B705",
  fontSize: "13px",
  margin: "0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

const contentStyle = {
  padding: "32px",
};

const h2Style = {
  color: "#0E2318",
  fontSize: "20px",
  marginTop: "0",
  marginBottom: "20px",
};

const labelStyle = {
  color: "#2E7D4F",
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  fontWeight: "bold",
  margin: "0 0 8px 0",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
  marginBottom: "24px",
};

const tdLabelStyle = {
  color: "#163A28",
  fontSize: "13px",
  fontWeight: "bold",
  padding: "6px 0",
  width: "40%",
  verticalAlign: "top" as const,
};

const tdValueStyle = {
  color: "#0E2318",
  fontSize: "13px",
  padding: "6px 0 6px 12px",
  verticalAlign: "top" as const,
};

const hrStyle = {
  borderColor: "#EFDB74",
  margin: "24px 0",
};

const actionLinkStyle = {
  color: "#163A28",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "underline",
};

const buttonStyle = {
  backgroundColor: "#F2B705",
  color: "#08170F",
  fontSize: "14px",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "8px",
};

const footerStyle = {
  backgroundColor: "#08170F",
  padding: "20px 32px",
};

const footerTextStyle = {
  color: "#FBE98F",
  fontSize: "12px",
  margin: "4px 0",
  opacity: 0.7,
};
