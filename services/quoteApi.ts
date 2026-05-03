export async function getQuote() {
  try {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();

    return {
      content: data.content,
      author: data.author,
    };
  } catch (error) {
    return {
      content: "Small steps every day build strong habits.",
      author: "Bloom Space",
    };
  }
}