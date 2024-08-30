import { ObjectId } from "mongodb";

import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({
  params,
}: {
  params: { storeId: string; colorId: string };
}) => {
  if (params.colorId === "new") {
    return (
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ColorForm initialData={null} />
        </div>
      </div>
    );
  }

  if (!ObjectId.isValid(params.colorId)) {
    return <div>Invalid color ID</div>;
  }

  const color = await prismadb.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
