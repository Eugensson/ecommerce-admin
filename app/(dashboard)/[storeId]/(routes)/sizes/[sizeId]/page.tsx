import { ObjectId } from "mongodb";

import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

const SizePage = async ({
  params,
}: {
  params: { storeId: string; sizeId: string };
}) => {
  if (params.sizeId === "new") {
    return (
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <SizeForm initialData={null} />
        </div>
      </div>
    );
  }

  if (!ObjectId.isValid(params.sizeId)) {
    return <div>Invalid size ID</div>;
  }

  const size = await prismadb.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
