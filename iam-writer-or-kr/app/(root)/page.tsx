import Hello from "../components/hello";

export default function Home() {
  console.log("What am i doing here? -- SERVER");
  return (
    <>
      <h1>Welcome to Viv</h1>
      <Hello />
    </>
  );
}
