import {useDispatch} from "react-redux";
// local
import nextAuth from "../../middlewares/nextAuth";
import {loginUser} from "../../utils/user/userSlice";
import Layout from "../../components/Layout";
import CafeRedactor from "../../components/Cafe/Redactor";
// mui
import Typography from "@mui/material/Typography";

const CafeCreate = ({user}) => {
    const dispatch = useDispatch()
    if (user) dispatch(loginUser(user))

    return (
        <Layout>
            <Typography variant={"h4"} sx={{p:2}}>
                Добавление нового кафе
            </Typography>
            <CafeRedactor/>
        </Layout>
    )

}


export async function getServerSideProps ({req}) {
    const user = await nextAuth(req)

    return user
        ? {props: {user}}
        : {redirect : {destination: '/', permanent: false}}
}

export default CafeCreate