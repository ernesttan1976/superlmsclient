import axios from "axios"

export async function getCourses(){
    try {
        const res = await axios.get(`http://localhost:3001/courses`,
            {
                params: {
                    _sort: "title"
                }
            })
        return res.data;
    } catch (error) {
        return error
    }}



export async function getCourse(id){
    try {
        const res = await axios.get(`http://localhost:3001/courses/${id}`,
            {
                params: {
                    _sort: "title"
                }
            })
        return res.data;
    } catch (error) {
        return error
    }}

export async function createCourse(courseProps){
    try{
        const res = await axios.post(`http://localhost:3001/courses`, courseProps)
        return res.data;
    } catch (error) {
        return error
    }
}
export async function getCoursesPaginated(page){
    const LIMIT = 2;
    const res = await axios.get(`http://localhost:3001/courses`,{
        params: {_page: page, _sort: "title", _limit: LIMIT, _: ""},
        headers: {
            'x-total-count': 'true',
            'nextpage': 'true',
            'previouspage': 'true',
        },
    })

        const totalCount = parseInt(res.headers["x-total-count"])
        const nextPage = res.headers["nextpage"] ? parseInt(res.headers["nextpage"]):null;
        const previousPage = res.headers["previouspage"] ? parseInt(res.headers["previouspage"]): null;
      
        return ({
            nextPage,
            previousPage,
            courses: res.data,
        })
}
