import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  orderId: string;
  orderDate: Date;
  items: any[];
  totalAmount: number;
  supportEmail: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  orderId,
  orderDate,
  items,
  totalAmount,
  supportEmail,
}) => (
  <div
    style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: "#1e1e2e",
      padding: "20px",
      color: "#cdd6f4",
    }}
  >
    <div
      style={{
        backgroundColor: "#181825",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ color: "#cdd6f4", marginBottom: "20px" }}>
        Thank you for your order, {firstName}!
      </h1>
      <p>
        Your order <strong>#{orderId}</strong> has been received and is getting processed.
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #cdd6f4",
          margin: "20px 0",
        }}
      />

      <h2 style={{ color: "#cdd6f4", marginBottom: "10px" }}>Order Details:</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#6c7086" }}>
            <th style={{ textAlign: "left", padding: "10px" }}>Item</th>
            <th style={{ textAlign: "center", padding: "10px" }}>Quantity</th>
            <th style={{ textAlign: "right", padding: "10px" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "10px", borderBottom: "1px solid #cdd6f4" }}>
                {item.beat.name}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "10px",
                  borderBottom: "1px solid #cdd6f4",
                }}
              >
                {item.licenseOption.name}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px",
                  borderBottom: "1px solid #cdd6f4",
                }}
              >
                {item.price}€
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          textAlign: "right",
          marginBottom: "20px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        Total: {totalAmount}€
      </div>

      <a
        href={`http://localhost:3000/orders/${orderId}`}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#cdd6f4",
          color: "#11111b",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        View Your Order
      </a>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #cdd6f4",
          margin: "20px 0",
        }}
      />

      <p style={{ fontSize: "14px", color: "#bac2de" }}>
        If you have any questions or need help, contact us at{" "}
        <a href={`mailto:${supportEmail}`} style={{ color: "#4caf50" }}>
          {supportEmail}
        </a>
        .
      </p>
      <p style={{ fontSize: "14px", color: "#a6adc8" }}>
        Thank you for shopping with us!
      </p>
    </div>
  </div>
);
