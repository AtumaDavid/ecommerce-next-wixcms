import { wixClientServer } from "@/lib/wixClientServer";
import { products } from "@wix/stores";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PRODUCT_PER_PAGE = 20;

export default async function ProductList({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) {
  const wixClient = await wixClientServer();
  const res = await wixClient.products
    .queryProducts()
    .eq("collectionIds", categoryId)
    .limit(limit || PRODUCT_PER_PAGE)
    .find();

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {res.items.map((product: products.Product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="object-cover absolute rounded-md z-10 hover:opacity-0 transition-opacity ease-in duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="object-cover absolute rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">
              {product.price?.currency}
              {product.price?.price}
            </span>
          </div>
          {/* <div className="text-sm text-gray-500">{product.description}</div> */}
          {/* <div
            className="text-sm text-gray-500"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(product.description || ""),
            }}
          /> */}
          <div
            className="text-sm text-gray-500 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />
          <button className="rounded-2xl  ring-1 ring-primary text-primary py-2 px-4 text-xs hover:bg-primary hover:text-white w-max">
            Add to cart
          </button>
        </Link>
      ))}
    </div>
  );
}
