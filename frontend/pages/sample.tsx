import Widget from "@/components/Widget";
import Layout from "@/components/layout";
import { useState } from "react";
export default function HomePage() {
  const [cid, setcid] = useState(0)

  return (
    <Layout pageTitle="Home">
      <input
                onChange={(e: any) => {
                  setcid(e.target.value );
                }}
                type="number"
                className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
                placeholder="Enter Campaign ID"
              />
      <Widget campId={1}/>
    </Layout>
  );
}
