const multiparty = require('multiparty')
const fs = require('fs')

let products = [
    {
        id: 1,
        name: 'iPhone XS',
        price: 1199,
        img: '/img/iphone-xs-512gb-xam-2-750x500.jpg',
        desc: `Là chiếc điện thoại iPhone sở hữu dung lượng khủng nhất, iPhone Xs 512GB còn có cấu hình mạnh mẽ với chip Apple A12 mới
        lần đầu tiên trang bị 2 SIM và camera tích hợp trí tuệ nhân tạo AI.`,
    },
    {
        id: 2,
        name: 'iPhone 12 Pro',
        price: 1399,
        img: '/img/iphone-12-pro-256gb-1-750x500.jpg',
        desc: `Điện thoại iPhone 12 Pro 256 GB khi được ra mắt đã có sự thay đổi lớn về thiết kế bên ngoài và chứa đựng một hiệu năng cực khủng bên trong, kèm theo đó là một loạt các công nghệ ấn tượng về camera,
        kết nối 5G lần đầu được xuất hiện.`,
    },
    {
        id: 3,
        name: 'Macbook Pro 13" M1',
        price: 1299,
        img: '/img/macbook-pro-m1-2020-silver-01-750x500.jpg',
        desc: `Macbook Pro M1 2020 được nâng cấp với bộ vi xử lý mới cực kỳ mạnh mẽ, chiếc laptop này sẽ phục vụ tốt cho công việc của bạn, đặc biệt cho lĩnh vực đồ họa, kỹ thuật.
        Tăng cường không gian lưu trữ, tốc độ xử lý Chip Apple M1 là một bộ vi xử lý mạnh mẽ, được ra mắt lần đầu tiên trên máy Mac.
        Đây là con chip sản xuất trên tiến trình 5 nm, tích hợp CPU 8 lõi với 4 lõi CPU tốc độ và và 4 lõi tiết kiệm năng lượng. Nhờ vậy, thời lượng pin của laptop được kéo dài đến tận 10 tiếng đồng hồ, giúp cho bạn thoải mái làm việc với một hiệu suất cực kỳ cao.`,
    },
    {
        id: 4,
        name: 'Airpod',
        price: 499,
        img: '/img/tai-nghe-bluetooth-airpods-pro-2nd-gen-usb-c-charge-apple-1-750x500.jpg',
        desc: `AirPods Pro Gen 2 sở hữu thiết kế mang đậm chất thương hiệu Apple, màu sắc sang trọng, đi cùng nhiều công nghệ cho các iFan: chip Apple H2, chống bụi, chống ồn chủ động,...
        hứa hẹn mang đến trải nghiệm âm thanh sống động, chinh phục người dùng.`,
    },
]

exports.getHomePage = (req, res) => {
    if (!req.session.username) return res.redirect('/login')
    res.render('home', { products })
}

exports.getLoginPage = (req, res) => {
    if (req.session.username) return res.redirect('/')
    res.render('login')
}

exports.postLoginPage = (req, res) => {
    let email = req.body.email
    let password = req.body.password
    if (process.env.EMAIL != email || process.env.PASSWORD != password) {
        return res.render('login', {
            msg: 'Tài khoản hoặc mật khẩu không hợp lệ!',
        })
    }

    req.session.username = email
    res.redirect('/')
}

exports.getAddPage = (req, res) => {
    if (!req.session.username) return res.redirect('/login')
    res.render('add')
}

exports.postAddPage = (req, res) => {
    if (!req.session.username) {
        return res.status(403).redirect('/login')
    }

    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if (err) return res.render('add', { msg: err.message })

        let { name, price, desc } = fields
        let { img } = files
        if (!name || !price || !desc || !img[0].originalFilename)
            return res.render('add', { msg: 'Vui lòng nhập đầy đủ thông tin' })

        let id =
            products.length === 0 ? 1 : products[products.length - 1].id + 1
        let product = {
            id: id,
            name: name[0],
            price: +price[0],
            desc: desc[0],
        }

        let imgPath = img[0].originalFilename

        fs.readFile(img[0].path, (err, data) => {
            if (err) throw Error('Read file failed!')
            fs.writeFile(`public/img/${imgPath}`, data, (err) => {
                if (err) console.log(err)
            })
        })

        product.img = `/img/${imgPath}`
        products.push(product)
        res.redirect('/')
    })
}

exports.getEditPage = (req, res) => {
    if (!req.session.username) return res.redirect('/login')
    let product = products.find((el) => el.id === +req.params.id)
    if (!product) return res.render('home', { msg: 'Internal Server Error' })
    res.render('edit', product)
}

exports.postEditPage = (req, res) => {
    if (!req.session.username) {
        return res.status(403).redirect('/login')
    }

    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
        if (err) return res.render('add', { msg: err.message })

        let { name, price, desc } = fields
        let { img } = files
        if (!name || !price || !desc || !img[0].originalFilename)
            return res.render('edit', { msg: 'Vui lòng nhập đầy đủ thông tin' })

        let product = {
            id: +req.params.id,
            name: name[0],
            price: +price[0],
            desc: desc[0],
        }

        let imgPath = img[0].originalFilename

        fs.readFile(img[0].path, (err, data) => {
            if (err) throw Error('Read file failed!')
            fs.writeFile(`public/img/${imgPath}`, data, (err) => {
                if (err) console.log(err)
            })
        })

        product.img = `/img/${imgPath}`
        let index = products.findIndex((el) => el.id == req.params.id)
        products[index] = product
        res.redirect('/')
    })
}

exports.postDelete = (req, res) => {
    let id = +req.body.id
    let deleteProduct = products.find((el) => el.id === id)
    if (!deleteProduct)
        return res.json({ success: false, msg: 'Product not found' })
    products = products.filter((el) => el.id !== id)

    let imgPath = deleteProduct.img.split('/').pop()
    fs.unlinkSync(`public/img/${imgPath}`)
    res.json({ success: true })
}

exports.getProduct = (req, res) => {
    if (!req.session.username) return res.redirect('/login')
    let product = products.find((el) => el.id == req.params.id)
    if (!product) return res.render('home', { msg: 'Internal Server Error' })
    res.render('product', product)
}
