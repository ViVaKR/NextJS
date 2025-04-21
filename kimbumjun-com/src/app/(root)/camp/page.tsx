import VivFeaturedCodeItems from "@/components/VivFeaturedCodeItems";
import VivTitle from "@/components/VivTitle";
import { fetchCategories } from "@/lib/fetchCategories";
import { fetchLimitedCodes } from "@/lib/fetchCodes";

async function fetchData() {
  const [codes, categories] = await Promise.all([
    fetchLimitedCodes(10),
    fetchCategories(),
  ]);
  return { codes, categories };
}

export default async function AppBarPage() {

  const { codes, categories } = await fetchData();
  const sortedData = () => {
    const data = [...codes].sort((a, b) => b.id - a.id);
    return data;
  }

  return (
    <>
      <VivTitle title="Camp" />
      <VivFeaturedCodeItems codes={sortedData()} categories={categories} />
      <div className='w-full min-h-screen'></div>
    </>
  )
}
