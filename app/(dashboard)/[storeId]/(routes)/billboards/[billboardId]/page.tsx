import { ObjectId } from "mongodb";

import prismadb from "@/lib/prismadb";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { storeId: string; billboardId: string };
}) => {
  if (params.billboardId === "new") {
    return (
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardForm initialData={null} />
        </div>
      </div>
    );
  }

  if (!ObjectId.isValid(params.billboardId)) {
    return <div>Invalid billboard ID</div>;
  }

  const billboard = await prismadb.billboard.findFirst({
    where: {
      id: params.billboardId,
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
