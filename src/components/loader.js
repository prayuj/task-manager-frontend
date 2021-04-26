import Spinner from 'react-bootstrap/Spinner'
import styled from 'styled-components'

const StyledDiv = styled.div`
        position: fixed;
        height: 100vh;
        width: 100vh;
        z-index: 1060;
        display: flex;
        justify-content: center;
        align-items: center;
    `

const Loader = ({ show }) => {

    if (show) {
        return (
            <>
                <StyledDiv>
                    <Spinner animation="grow" variant="primary" />
                </StyledDiv >
            </>);
    }

    return null;
}

export default Loader;