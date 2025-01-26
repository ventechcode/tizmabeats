import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"
import * as React from "react"

interface OrderConfirmationEmailProps {
  userName: string
  orderId: string
  beatLinceses: any
  userEmail: string
}

export const OrderConfirmationEmail = ({ userName, orderId, beatLinceses, userEmail }: OrderConfirmationEmailProps) => {
  const previewText = `Thanks for your purchase, ${userName.split(" ")[0]}!`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Row style={{ ...boxContent, alignItems: "center", justifyContent: "center" }}>
              <Column style={{ width: "100%", textAlign: "center" as const }}>
                <Img
                  src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/vercel-icon.png"
                  width="40"
                  height="40"
                  alt="Checkmark"
                  style={{ display: "inline", marginRight: "12px" }}
                />
                <Heading as="h1" style={headingGreen}>
                  Payment Successful
                </Heading>
              </Column>
            </Row>
            <Text style={{ ...paragraph, textAlign: "center" }}>{previewText}</Text>
            <Row style={orderInfo}>
              <Column>
                <Text style={orderInfoLabel}>Order:</Text>
              </Column>
              <Column align="right">
                <Text style={orderInfoValue}>#{orderId}</Text>
              </Column>
            </Row>
            <Hr style={hr} />
            <Row style={tableHeader}>
              <Column>
                <Text style={tableHeaderText}>Item</Text>
              </Column>
              <Column>
                <Text style={{ ...tableHeaderText, textAlign: "center" as const }}>Amount</Text>
              </Column>
              <Column align="right">
                <Text style={tableHeaderText}>Product</Text>
              </Column>
            </Row>
            <Hr style={hr} />
            {beatLinceses.map((item: any) => (
              <Row key={item.id} style={tableRow}>
                <Column>
                  <Text style={beatName}>{item.beat.name}</Text>
                  <Text style={licenseName}>{item.licenseOption.name}-License</Text>
                </Column>
                <Column>
                  <Text style={{ ...beatPrice, textAlign: "center" as const }}>{item.price}€</Text>
                </Column>
                <Column align="right">
                  <Link style={downloadLink} href={`http://localhost:3000/api/download?id=${item.download.id}`}>
                    Download
                  </Link>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Text style={paragraph}>
              Order confirmation has been sent to{" "}
              <Link href={`mailto:${userEmail}`} style={link}>
                {userEmail}
              </Link>
              .
            </Text>
            <Text style={paragraph}>You can also download the files later from your email.</Text>
            <Text style={paragraph}>Links will expire after 72 hours.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default OrderConfirmationEmail

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const box = {
  padding: "0 48px",
}

const boxContent = {
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  padding: "40px 48px",
}

const headingGreen = {
  color: "#22c55e",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "16px 0",
}

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
}

const orderInfo = {
  margin: "16px 0",
}

const orderInfoLabel = {
  color: "#8898aa",
  fontSize: "12px",
  fontWeight: "600",
}

const orderInfoValue = {
  color: "#525f7f",
  fontSize: "12px",
  fontWeight: "600",
}

const hr = {
  borderColor: "#e6ebf1",
  margin: "16px 0",
}

const tableHeader = {
  margin: "16px 0",
}

const tableHeaderText = {
  color: "#8898aa",
  fontSize: "12px",
  fontWeight: "600",
}

const tableRow = {
  margin: "16px 0",
}

const beatName = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0",
}

const licenseName = {
  color: "#8898aa",
  fontSize: "14px",
  margin: "4px 0 0",
}

const beatPrice = {
  color: "#525f7f",
  fontSize: "14px",
  fontWeight: "500",
}

const downloadLink = {
  color: "#3b82f6",
  fontSize: "14px",
  textDecoration: "none",
}

const link = {
  color: "#3b82f6",
  textDecoration: "none",
}

