import Pagination from 'react-bootstrap/Pagination'

const PaginationTemplate = (curr) => {
    return (
        <Pagination>
            <Pagination.Prev />
            <Pagination.Next />
        </Pagination>);
}

export default PaginationTemplate;