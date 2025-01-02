import * as React from "react";

interface EmailTemplateProps {
  firstName: string;
  orderId: string;
  orderDate: Date;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
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
      backgroundColor: "#f9f9f9",
      padding: "20px",
      color: "#333",
    }}
  >
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1 style={{ color: "#4caf50", marginBottom: "20px" }}>
        Thank you for your order, {firstName}!
      </h1>
      <p>
        Your order <strong>#{orderId}</strong> was placed on{" "}
        <strong>
          {orderDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </strong>
        .
      </p>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ddd",
          margin: "20px 0",
        }}
      />

      <h2 style={{ color: "#333", marginBottom: "10px" }}>Order Details:</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f3f3f3" }}>
            <th style={{ textAlign: "left", padding: "10px" }}>Item</th>
            <th style={{ textAlign: "center", padding: "10px" }}>Quantity</th>
            <th style={{ textAlign: "right", padding: "10px" }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                {item.name}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                }}
              >
                {item.price.toFixed(2)}€
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
        Total: {totalAmount.toFixed(2)}€
      </div>

      <a
        href="http://localhost:3000"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#4caf50",
          color: "#fff",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        View Your Order
      </a>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #ddd",
          margin: "20px 0",
        }}
      />

      <p style={{ fontSize: "14px", color: "#777" }}>
        If you have any questions or need help, contact us at{" "}
        <a href={`mailto:${supportEmail}`} style={{ color: "#4caf50" }}>
          {supportEmail}
        </a>
        .
      </p>
      <p style={{ fontSize: "14px", color: "#777" }}>
        Thank you for shopping with us!
      </p>
    </div>
  </div>
);
