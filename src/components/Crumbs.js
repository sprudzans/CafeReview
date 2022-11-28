import NextLink from "next/link";
import {useRouter} from "next/router";
// mui
import Container from "@mui/material/Container";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";

const pages = [
    {path: "/", name:"Главная"},
    {path: "/signup", name: "Регистрация"},
    {path: "/login", name: "Войти"},
    {path: "/user", name: "Профиль"},
    {path: "/user/book", name: "История"},
    {path: "/user/setting", name: "Обновить профиль"},
    {path: "/review", name: "Отзывы"},
    {path: "/review/create", name: "Добавить отзыв"},
    {path: "/review/update", name: "Обновить отзыв"},
    {path: "/cafe", name: "Кафе"},
    {path: "/cafe/create", name: "Добавить кафе"},
    {path: "/cafe/update", name: "Обновить кафе"},
    {path: "/404", name: "Ошибка"}
]

const Crumbs = () => {
    const router = useRouter();

    const url = router.pathname

    if (url.length < 2) return

    // todo нужно что-то придумать с отображением детальных страниц и страницы создания отзыва

    const crumbs = url
        .replace('[id]', '')
        .split('/')
        .filter(_ => _)
        .map((el, index, array) => {
            if (index) return '/' + array[index-1] + '/' + el
            else return '/' + el
        })
        .map(el => pages.find(pg => pg.path === el))
        .filter(_ => _)

    return (
        <Box>
            <Container>
                <Breadcrumbs aria-label="breadcrumb">
                    {crumbs.map((el, index) => (
                        <Typography key={index}>
                            <NextLink href={el.path || ''} passHref>
                                <Link
                                    underline="hover"
                                    color="text.primary"
                                    key={index}
                                    aria-current="page">
                                    {el.name}
                                </Link>
                            </NextLink>
                        </Typography>
                    ))}
                </Breadcrumbs>
            </Container>
        </Box>
    )
}

export default Crumbs