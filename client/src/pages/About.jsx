export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold">About Farmer Marketplace</h1>
      <p className="mt-4 max-w-prose leading-relaxed text-soil-700">
        Many farmers sell through several middlemen and lose a large part of the price to them. Many buyers cannot tell where
        their produce came from. Farmer Marketplace connects the two directly: farmers list what they have grown, buyers browse and
        order, and farmers confirm and deliver.
      </p>
      <h2 className="mt-8 text-2xl font-bold">How it works</h2>
      <div className="mt-3 space-y-3 text-soil-700">
        <p><strong>Farmers</strong> register, add their crops and products with price, quantity and photos, then accept and fulfil orders.</p>
        <p><strong>Buyers</strong> search by crop, category, location and price, add products to the cart and place an order. Payment is cash on delivery.</p>
        <p><strong>Everyone</strong> can read general crop information and check the weather for their area.</p>
      </div>
      <h2 className="mt-8 text-2xl font-bold">About the crop information</h2>
      <p className="mt-3 max-w-prose text-soil-700">
        Crop guides are general references. Sowing dates, varieties and fertilizer quantities differ by region, so confirm them with
        your local agriculture department or Krishi Vigyan Kendra before acting.
      </p>
    </div>
  );
}
