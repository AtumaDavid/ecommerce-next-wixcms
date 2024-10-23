import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductList() {
  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      <Link
        href="/"
        className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
      >
        <div className="relative w-full h-80">
          <Image
            src="https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt=""
            fill
            sizes="25vw"
            className="object-cover absolute rounded-md z-10 hover:opacity-0 transition-opacity ease-in duration-500"
          />
          <Image
            src="https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt=""
            fill
            sizes="25vw"
            className="object-cover absolute rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Product Name</span>
          <span className="font-semibold">$56</span>
        </div>
        <div className="text-sm text-gray-500">My description</div>
        <button className="rounded-2xl  ring-1 ring-primary text-primary py-2 px-4 text-xs hover:bg-primary hover:text-white w-max">
          Add to cart
        </button>
      </Link>
    </div>
  );
}
