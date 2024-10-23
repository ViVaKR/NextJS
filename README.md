# NextJS

NextJS

```bash
    npx create-next-app@latest

```

###### Catch-all Segments

- Secnario 6

> Docs for F1 C1
> localhost:3000/docs/feature1/concept1
> localhost:3000/docs/feature1/concept2
> localhost:3000/docs/feature2/concept1
> localhost:3000/docs/feature2/concept2
> localhost:3000/docs/frature1/concept1/example1
> 20 Features X 20 Concepts = 400
> 20 Features X 1 [conceptId] = 20

Feature 1
  Concept 1
  Concept 2
  Concept 3

Feature 2
Feature 3
Feature 4
Feature 5

###### 마크다운 문서와 HTML 렌더링된 CSS tags 연관관계

- `헤더, # ~ ######` : `<h1> ~ <h6>`
- `단락 빈줄로 구분된 텍스트 (Paragraphs)` : `<p>`
- 인용문, Blockquotes, `>` : `<blockquote>`
- `목록 (List)` `-`, `*`, `+` : `<ul>` (순서없는 목록)
- `1.`, `2.`, `3.` : `<ol>` (순서가 있는 목록)
- `목록항목` : `<li>`
- `인라인 코드` : `<code>` ~ `<code>`
- ` ```블록코드``` ` : `<pre><code>`
- `*italic*`, `_italic_` : `<em>`
- `**bold**`, `__bold__` : `<strong>`
- ``~~` strikethrought `~~`<del>`
- `link` : `<a>`
- `이미지 ~alt text` : `<img>`
- `수평선 ---, ***, ___` : `<hr>`

예시 CSS

```css
h1 {
  color: blue;
}

h2 {
  color: green;
}

p {
  font-size: 16px;
}

blockquote {
  border-left: 4px solid #ccc;
  padding-left: 10px;
  color: #666;
}

ul {
  list-style-type: disc;
}

ol {
  list-style-type: decimal;
}

li {
  margin-bottom: 5px;
}

code {
  background-color: #f4f4f4;
  padding: 2px 4px;
  border-radius: 4px;
}

pre code {
  display: block;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 4px;
}

em {
  font-style: italic;
}

strong {
  font-weight: bold;
}

del {
  text-decoration: line-through;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

hr {
  border: 0;
  height: 1px;
  background: #ccc;
}
```
