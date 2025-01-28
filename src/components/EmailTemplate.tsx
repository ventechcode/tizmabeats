import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  userName: string;
  orderId: string;
  beatLinceses: any;
}

export const OrderConfirmationEmail = ({
  userName,
  orderId,
  beatLinceses,
}: OrderConfirmationEmailProps) => {
  const previewText = `Thanks for your purchase, ${userName.split(" ")[0]}!`;

  return (
    <Tailwind
      config={{
        darkMode: "class",
        plugins: [
          require("@catppuccin/tailwindcss")({
            prefix: false,
            defaultTheme: "mocha",
          }),
        ],
        theme: {
          extend: {
            colors: {
              base: "#f9f9f9",
              mantle: "#f5f5f5",
              crust: "#f9a826",
              text: "#333333",
              subtext0: "#4f4f4f",
            },
            fontFamily: {
              sans: ["Inter", "sans-serif"],
            },
          },
        },
      }}
    >
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="bg-mantle font-sans">
          <Container className="bg-base mx-auto my-0 p-5 pb-12 mb-16 max-w-3xl rounded-lg shadow-sm">
            <div className="px-12 py-10 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center mb-6">
                <div className="text-center w-full">
                  <Heading className="text-text text-2xl font-semibold mt-4 mb-2">
                    Order Confirmation
                  </Heading>
                </div>
              </div>

              <Text className="text-text text-base leading-6 text-center mb-6">
                {previewText}
              </Text>

              <div className="flex justify-between mb-4">
                <Text className="text-subtext0 text-xs font-semibold">
                  Order:
                </Text>
                <Text className="text-subtext0 text-xs font-semibold">
                  #{orderId}
                </Text>
              </div>

              <Hr className="border-t border-gray-200 my-4" />

              <div className="flex justify-between mb-4">
                <Text className="text-gray-500 text-xs font-semibold">
                  Item
                </Text>
                <Text className="text-gray-500 text-xs font-semibold text-center">
                  Amount
                </Text>
                <Text className="text-gray-500 text-xs font-semibold text-right">
                  Product
                </Text>
              </div>

              <Hr className="border-t border-gray-200 my-4" />

              {beatLinceses.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start mb-4"
                >
                  <div className="flex-1">
                    <Text className="text-gray-900 text-base font-medium">
                      {item.beat.name}
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {item.licenseOption.name}-License
                    </Text>
                  </div>
                  <Text className="text-[#525f7f] text-sm font-medium mx-4">
                    {item.price}€
                  </Text>
                  <Link
                    href={`http://localhost:3000/api/download?id=${item.download.id}`}
                    className="text-blue-500 text-sm no-underline hover:underline"
                  >
                    Download
                  </Link>
                </div>
              ))}

              <Link
                href={`http://localhost:3000/orders/${orderId}`}
                className="bg-crust text-text text-center text-sm font-semibold rounded-lg py-2 px-4 mt-6 inline-block"
              >
                View Order
              </Link>
            </div>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default OrderConfirmationEmail;
