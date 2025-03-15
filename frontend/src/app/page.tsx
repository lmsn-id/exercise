import DashboardHome from "~/components/home/Dashboard";
import ServiceHome from "~/components/home/Service";
import InformationHome from "~/components/home/Information";
export default function Home() {
  return (
    <>
      <DashboardHome />
      <ServiceHome />
      <InformationHome />
    </>
  );
}
