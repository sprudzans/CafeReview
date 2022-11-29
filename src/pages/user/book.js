import NextLink from "next/link";
import {useDispatch} from "react-redux";
// local
import auth from "../../middlewares/auth";
import {getBookArray} from "../../middlewares/dbReq";
import {loginUser} from "../../utils/user/userSlice";
import Layout from "../../components/Layout";
// mui
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";


const UserBook = ({user, history}) => {
    const dispatch = useDispatch()
    if (user) dispatch(loginUser(user))

    return (
        <Layout>
            {history.length ? (
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Ресторан</TableCell>
                                <TableCell align="right">Дата</TableCell>
                                <TableCell align="right">Кол-во гостей</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {history.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                >
                                    <TableCell component="th" scope="row">
                                        <NextLink passHref href={'/cafe/' + row.cafe._id}>
                                            <Link underline="none" color={"secondary"}>
                                                {row.cafe.title}
                                            </Link>
                                        </NextLink>
                                    </TableCell>
                                    <TableCell align="right">{row.date}</TableCell>
                                    <TableCell align="right">{row.person}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) :  <Typography>Бронирований не найдено</Typography> }
        </Layout>
    )
}

export async function getServerSideProps({req, res}) {
    await auth.run(req, res);
    const user = req.user || false

    if (!user) return {redirect: {destination: '/', permanent: false}}

    const history = await getBookArray({user: user.id})

    return {props: {user, history}}
}

export default UserBook