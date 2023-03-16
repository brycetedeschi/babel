const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  const { bookTitle, bookAuthor, currentPage, userQuestion } = JSON.parse(event.body);

  const prompt = `You will act as an expert on ${bookTitle} written by ${bookAuthor}. I am on page ${currentPage} of ${bookTitle} and I have a question about the book, but to avoid giving away any spoilers, only use information from pages 1-${currentPage} when answering my question. My question is: ${userQuestion}`;

  const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    }),
  });

  const responseData = await response.json();
  const answer = responseData.choices[0].text.trim();

  return {
    statusCode: 200,
    body: JSON.stringify({ answer }),
  };
};
