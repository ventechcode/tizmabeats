import * as React from "react";
import { Preview } from "@react-email/components"; // Add this import

interface OrderConfirmationEmailProps {
  userName: string;
  orderId: string;
  beatLinceses: {
    id: string;
    beat: {
      name: string;
    };
    price: number;
    licenseOption: {
      name: string;
    };
    download: {
      id: string;
      url: string;
    } | null;
  }[];
}

export const OrderConfirmationEmail = ({
  userName,
  orderId,
  beatLinceses,
}: OrderConfirmationEmailProps) => (
  <div
    style={{
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      maxWidth: "100%",
      alignItems: "center",
      borderRadius: "8px",
      backgroundColor: "#eff1f5",
      padding: "20px",
      color: "#4c4f69",
    }}
  >
    <Preview>Thanks for your purchase, {userName}!</Preview>

    <div
      style={{
        maxWidth: "600px",
        backgroundColor: "#e6e9ef",
        borderRadius: "8px",
        margin: "0 auto",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{ color: "#4c4f69", marginBottom: "20px", textAlign: "center" }}
      >
        Order Receipt
      </h1>

      <div
        style={{
          width: "100%",
          marginBottom: "10px",
          color: "#4c4f69",
        }}
      >
        <span style={{ float: "left" }}>
          <strong>Order:</strong>
        </span>
        <span style={{ float: "right" }}>
          <strong>#{orderId}</strong>
        </span>
        <div style={{ clear: "both" }}></div>{" "}
        {/* Required for float clearing */}
      </div>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead style={{ borderRadius: "8px" }}>
          <tr style={{ backgroundColor: "#dce0e8", borderRadius: "8px" }}>
            <th
              style={{ textAlign: "left", padding: "12px", color: "#6c6f85" }}
            >
              Beat
            </th>
            <th
              style={{ textAlign: "center", padding: "12px", color: "#6c6f85" }}
            >
              License
            </th>
            <th
              style={{ textAlign: "right", padding: "12px", color: "#6c6f85" }}
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody style={{ borderRadius: "8px" }}>
          {beatLinceses.map((item: any) => (
            <tr key={item.id}>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #acb0be",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "150px",
                  color: "#6c6f85",
                  borderRadius: "8px",
                }}
                title={item.beat.name}
              >
                {item.beat.name}
              </td>
              <td
                style={{
                  textAlign: "center",
                  padding: "10px",
                  borderBottom: "1px solid #acb0be",
                  color: "#6c6f85",
                }}
              >
                {item.licenseOption?.name}
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px",
                  borderBottom: "1px solid #acb0be",
                  color: "#6c6f85",
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
          fontSize: "17px",
          color: "#4c4f69",
        }}
      >
        <strong>Total: </strong>
        {beatLinceses.reduce((acc, item) => acc + item.price, 0).toString()}€
      </div>

      <a
        href={`http://localhost:3000/orders/${orderId}`}
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: "#11111b",
          color: "#dce0e8",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold",
        }}
      >
        View Order
      </a>

      <hr
        style={{
          border: "none",
          borderTop: "1px solid #acb0be",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      />

      <p style={{ fontSize: "14px", color: "#5c5f77", textAlign: "center" }}>
        If you have any questions or need help, don&apos;t hesitate to contact us at{" "}
        <a href={`mailto:support@tizmabeats.com`} style={{ color: "#1e66f5" }}>
          support@tizmabeats.com
        </a>
      </p>
      <p style={{ fontSize: "14px", color: "#6c6f85", textAlign: "center" }}>
        Thanks for shopping with us!
      </p>
      <p style={{ color: "#6c6f85", textAlign: "center", fontSize: "14px" }}>
        <strong>2025 © TIZMABEATS</strong>
      </p>
    </div>
  </div>
);
