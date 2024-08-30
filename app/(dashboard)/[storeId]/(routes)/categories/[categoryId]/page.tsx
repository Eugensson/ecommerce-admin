import { ObjectId } from "mongodb";

import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: { storeId: string; categoryId: string };
}) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  if (params.categoryId === "new") {
    return (
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <CategoryForm billboards={billboards} initialData={null} />
        </div>
      </div>
    );
  }

  if (!ObjectId.isValid(params.categoryId)) {
    return <div>Invalid category ID</div>;
  }

  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
