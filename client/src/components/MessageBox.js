import { Row, Col, Alert } from 'react-bootstrap';

function MessageBox(props) {
   return (
      <Row style={{ width: "50%" }}>
         <Col>
            <Alert key='dark' variant='dark'>{props.message}</Alert>
         </Col>
      </Row>
   );
}

export { MessageBox };