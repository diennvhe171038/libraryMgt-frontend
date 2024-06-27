import React from 'react';
import { Col, Row, Nav, Tab } from 'react-bootstrap';
import CopiesTab from './CopiesTab';
import AuthorsTab from './AuthorsTab';
import ReviewsTab from './ReviewsTab';

const BookDetailTabs = ({ bookDetail }) => {
    const { copies, authors, reviews } = bookDetail;

    return (
        <div style={{ height: '100%' }}>
            <Tab.Container id="book-detail-tabs" defaultActiveKey="copies">
                <Row>
                    <Col md={12}>
                        <Nav variant="tabs" className="justify-content-center">
                            <Nav.Item>
                                <Nav.Link eventKey="copies" style={{ fontSize: 'small', color: '#000' }}>Các bản copy</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="authors" style={{ fontSize: 'small', color: '#000' }}>Tác giả</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="reviews" style={{ fontSize: 'small', color: '#000' }}>Đánh giá</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Row>
                <Row>
                    <Col md={12} style={{ height: '100%' }}>
                        <Tab.Content style={{ height: '100%' }}>
                            <Tab.Pane eventKey="copies" style={{ height: '100%' }}>
                                <CopiesTab copies={copies} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="authors" style={{ height: '100%' }}>
                                <AuthorsTab authors={authors} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="reviews" style={{ height: '100%' }}>
                                <ReviewsTab reviews={reviews} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
};

export default BookDetailTabs;