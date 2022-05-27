import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createDrink, getDrink } from "~/models/drink.server";

import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

type LoaderData = { drinks: Awaited<ReturnType<typeof getDrink>> };

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const drinkName = form.get("drinkName");

  if (drinkName !== "coffee" && drinkName !== "water") {
    throw new Error("Invalid form values.");
  }

  await createDrink(drinkName);
  return redirect("/");
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    drinks: await getDrink(),
  });
};

export default function Index() {
  const { drinks } = useLoaderData<LoaderData>();

  return (
    <>
      <Form method='post' className='my-6 text-center'>
        <label htmlFor='drinkName'>
          <span className='inline-block w-full text-2xl font-semibold border-b-2 sm:text-3xl'>
            Submit Drink Consumed Today
          </span>
          <select
            name='drinkName'
            className='w-32 px-4 py-2 mt-4 rounded-full bg-slate-500'>
            <option value='water'>Water 💧</option>
            <option value='coffee'>Coffee ☕</option>
          </select>
        </label>
        <button
          type='submit'
          className='px-4 py-2 mt-4 ml-2 rounded-full bg-slate-500'>
          Add
        </button>
      </Form>
      <div className='grid justify-center w-full grid-cols-2 mx-auto text-2xl md:grid-cols-4 grid-items-center'>
        {drinks.map((drink) => (
          <Card key={drink.id} drink={drink} />
        ))}
      </div>
    </>
  );
}

function Card({ drink }: any) {
  const time = new Date(drink.createdAt).toDateString();

  return (
    <details
      className='p-2 m-2 text-center rounded-lg open:bg-white dark:open:bg-slate-900 open:ring-1 open:ring-black/5 dark:open:ring-white/10 open:shadow-lg'
      open>
      <summary className='text-sm font-semibold leading-6 text-center select-none text-slate-900 dark:text-white'>
        {drink.name === "water" ? "💧" : "☕"}
      </summary>
      <div className='mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400'>
        <span className='inline-block w-full'>{drink.name}</span>
        <span> {time} </span>
      </div>
    </details>
  );
}
