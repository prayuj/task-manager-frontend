import Alert from 'react-bootstrap/Alert'
import styled from 'styled-components'

const StyledDiv = styled.div`
        position: fixed;
        height: 100vh;
        width: 100vw;
        z-index: 1060;
        display: flex;
        justify-content: center;
        align-items: center;
    `

const AlertComponent = ({ show, type, message }) => {

    if (show)
        return (
            <StyledDiv>
                <Alert variant={type}>
                    {message}
                </Alert>
            </StyledDiv>
        );
    return null;
}
export default AlertComponent;