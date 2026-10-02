import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { Inquiry } from "@prisma/client";

interface CustomerConfirmationEmailProps {
  inquiry: Inquiry;
}

export default function CustomerConfirmationEmail({
  inquiry,
}: CustomerConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        We received your request, Impact Energy Solution
      </Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Heading style={headingStyle}>Impact Energy Solution</Heading>
            <Text style={subHeadingStyle}>
              Solar, Water & Clean Energy for Malawi
            </Text>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            <Heading as="h2" style={h2Style}>
              Thank you, {inquiry.name}!
            </Heading>

            <Text style={textStyle}>
              We have received your quote request and will call you back within
              one business day to arrange a free site visit.
            </Text>

            <Hr style={hrStyle} />

            <Text style={labelStyle}>YOUR REQUEST SUMMARY</Text>

            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={tdLabelStyle}>Service</td>
                  <td style={tdValueStyle}>{inquiry.service}</td>
                </tr>
                <tr>
                  <td style={tdLabelStyle}>Location</td>
                  <td style={tdValueStyle}>{inquiry.location}</td>
                </tr>
                <tr>
                  <td style={tdLabelStyle}>Property</td>
                  <td style={tdValueStyle}>{inquiry.propertyType}</td>
                </tr>
                {inquiry.message && (
                  <tr>
                    <td style={tdLabelStyle}>Your message</td>
                    <td style={tdValueStyle}>{inquiry.message}</td>
                  </tr>
                )}
              </tbody>
            </table>

            <Hr style={hrStyle} />

            <Text style={labelStyle}>WHAT HAPPENS NEXT</Text>
            <Text style={textStyle}>
              1. We will call you on{" "}
              <strong style={{ color: "#163A28" }}>{inquiry.phone}</strong>{" "}
              within one business day.
            </Text>
            <Text style={textStyle}>
              2. We will schedule a free site visit to assess your property.
            </Text>
            <Text style={textStyle}>
              3. We will prepare a tailored system design and quote.
            </Text>

            <Hr style={hrStyle} />

            <Text style={textStyle}>
              Need to reach us in the meantime? Call Steve Khomba directly:
            </Text>
            <Text style={phoneStyle}>+265 881 682 589</Text>

            <Text style={{ ...textStyle, fontSize: "13px", color: "#163A28" }}>
              We operate from Lilongwe Area 23 and Area 49, Malawi.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Text style={footerTextStyle}>
              Impact Energy Solution, Lilongwe Area 23 and Area 49, Malawi.
            </Text>
            <Text style={footerTextStyle}>
              MERA licensed. Registered with the Registrar of Companies.
            </Text>
            <Text style={{ ...footerTextStyle, fontSize: "11px", opacity: 0.5 }}>
              You are receiving this because you submitted a quote request on our
              website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

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
  letterSpacing: "0.08em",
};

const contentStyle = {
  padding: "32px",
};

const h2Style = {
  color: "#0E2318",
  fontSize: "22px",
  marginTop: "0",
  marginBottom: "16px",
};

const textStyle = {
  color: "#0E2318",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 12px 0",
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
  margin: "20px 0",
};

const phoneStyle = {
  color: "#163A28",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "8px 0 16px 0",
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
