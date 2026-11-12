import CloudHubClient from "./CloudHubClient";

export const metadata = {
  title: "Hub de Correo Corporativo & Supabase | ATP DEV Admin",
  description: "Monitoreo en tiempo real y accesos directos a Zoho Mail (@atpdev.dev) y Supabase Cloud Database.",
};

export const dynamic = "force-dynamic";

export default function CloudHubPage() {
  return <CloudHubClient />;
}

