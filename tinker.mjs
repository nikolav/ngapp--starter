function foo(strings, ...values) {
  console.log({ strings });
  console.log({ values });
  return values.join(":");
}

const result = foo`x-${"y"}-z`;
console.log(result); // Hello Nikola!
