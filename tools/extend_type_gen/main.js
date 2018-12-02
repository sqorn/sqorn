function buildGenerics(n) {
  let generics = ''
  for (let i = 1; i <= n; ++i) {
    if (i !== 1) {
      generics += `,\n`
    }
    generics += buildGeneric(i)
  }
  return generics
}

function buildGeneric(n, spaces = '  ') {
  return `${spaces}Q${n}, S${n} extends States<Q${n}>, T${n} extends T${n -
    1} & S${n}`
}

function buildArgs(n, isLast) {
  let args = ''
  let i = 1
  for (; i <= n; ++i) {
    if (i !== 1) args += ', '
    if ((i - 1) % 8 === 0) args += `\n  `
    args += `q${i}: Q${i}`
  }
  // const last = isLast ? `,\n  ...queries: Q${i - 1}[]` : ''
  const last = `,\n  ...queries: Q${i - 1}[]`
  return args + last
}

function buildReturnType(n) {
  return `Next<T${n - 1} & Keys, S${n}>`
}

function buildExtend(n, isLast) {
  const generics = buildGenerics(n)
  const args = buildArgs(n, isLast)
  const returnType = buildReturnType(n)
  return `extend<
${generics}
>(${args}\n): ${returnType}`
}

function buildExtendUpTo(n) {
  let txt = ''
  for (let i = 1; i <= n; ++i) {
    if (i !== 1) {
      txt += `\n\n`
    }
    txt += buildExtend(i, i == n)
  }
  return txt
}

function buildInterface(n) {
  return `// Generated with /tools/extend_type_gen/main.js
import { Next } from './methods'
import { States, Keys } from './queries'
export interface Extend<T0 extends Keys> {
${buildExtendUpTo(n)
    .split('\n')
    .join('\n  ')}
}`
}

function main() {
  let n = process.argv[2] || 20
  // console.log(buildExtend(n))
  console.log(buildInterface(n))
}

main()
