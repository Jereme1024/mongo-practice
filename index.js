const sleep = (ms) => new Promise((reslove) => setTimeout(reslove, ms))

const main = async () => {
    console.log(new Date())
    await sleep(1000)
    console.log(new Date())
}
main()

