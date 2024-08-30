import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

// export async function POST(req: Request) {
//   const body = await req.text();
//   console.log("Received webhook request");
//   console.log("Request body:", body);
//   const signature = headers().get("Stripe-Signature") as string;
//   console.log("Stripe-Signature:", signature);

//   let event: Stripe.Event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET!
//     );
//   } catch (error: any) {
//     console.error("Webhook error:", error);
//     return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
//   }

//   const session = event.data.object as Stripe.Checkout.Session;
//   console.log("Session details:", session);

//   const address = session?.customer_details?.address;

//   const adressComponents = [
//     address?.line1,
//     address?.line2,
//     address?.city,
//     address?.state,
//     address?.postal_code,
//     address?.country,
//   ];

//   const addressString = adressComponents.filter((c) => c !== null).join(", ");

//   if (event.type === "checkout.session.completed") {
//     console.log("Processing checkout.session.completed");
//     console.log("Event type:", event.type);
//     const order = await prismadb.order.update({
//       where: {
//         id: session?.metadata?.orderId,
//       },
//       data: {
//         isPaid: true,
//         address: addressString,
//         phone: session?.customer_details?.phone || "",
//       },
//       include: {
//         orderItems: true,
//       },
//     });

//     const productIds = order.orderItems.map((orderItem) => orderItem.productId);

//     await prismadb.product.updateMany({
//       where: {
//         id: {
//           in: [...productIds],
//         },
//       },
//       data: {
//         isArchived: true,
//       },
//     });
//   }

//   return new NextResponse(null, { status: 200 });
// }

export async function POST(req: Request) {
  const body = await req.text();
  console.log("Received webhook request");
  console.log("Request body:", body);

  const signature = headers().get("Stripe-Signature") as string;
  console.log("Stripe-Signature:", signature);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("Webhook event:", event);
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("Processing checkout.session.completed");

    const session = event.data.object as Stripe.Checkout.Session;
    console.log("Session details:", session);

    const address = session?.customer_details?.address;
    const adressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];
    const addressString = adressComponents.filter((c) => c !== null).join(", ");

    try {
      const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
        include: {
          orderItems: true,
        },
      });
      console.log("Updated order:", order);

      const productIds = order.orderItems.map(
        (orderItem) => orderItem.productId
      );

      await prismadb.product.updateMany({
        where: {
          id: {
            in: [...productIds],
          },
        },
        data: {
          isArchived: true,
        },
      });
      console.log("Products archived");
    } catch (dbError) {
      console.error("Database error:", dbError);
    }
  }

  return new NextResponse(null, { status: 200 });
}
