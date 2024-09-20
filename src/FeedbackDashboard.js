import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale, // For bar chart x-axis
    LinearScale, // For bar chart y-axis
    BarElement, // For bars
    ArcElement, // For pie chart
    Tooltip, 
    Legend
} from 'chart.js';
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";

// Register the components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const FeedbackDashboard = () => {
    const [feedbackData, setFeedbackData] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        // Fetch feedback data from API
        axios.get("http://localhost:7000/api/admin/feedbacks")
            .then(response => {
                console.log("Feedback API raw response:", response); // Log raw response
                console.log("Feedback API response data:", response.data); // Log data part of the response
    
                
                if (response.data && Array.isArray(response.data.feedbacks)) {
                    const feedbacks = response.data.feedbacks;
                    setFeedbackData(feedbacks);
                    
                    const ratingsArray = feedbacks.map(fb => fb.rating);
                    const commentsArray = feedbacks.map(fb => fb.comment);
                    
                    setRatings(ratingsArray);
                    setComments(commentsArray);
                } else {
                    console.error("Expected an array of feedbacks but got:", response.data);
                }
                
            })
            .catch(error => {
                console.error("Error fetching feedback data:", error);
            });
    }, []);
    
    // Prepare data for bar chart (for ratings distribution)
    const ratingsDistribution = {
        labels: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Very Good", "5 - Excellent"],
        datasets: [
            {
                label: "Ratings Distribution",
                data: [
                    ratings.filter(r => r === 1).length,
                    ratings.filter(r => r === 2).length,
                    ratings.filter(r => r === 3).length,
                    ratings.filter(r => r === 4).length,
                    ratings.filter(r => r === 5).length
                ],
                backgroundColor: ["#f44336", "#ff9800", "#ffeb3b", "#4caf50", "#2196f3"],
                borderWidth: 1,
            },
        ],
    };
    const ratingsPieData = {
        labels: ["1 - Poor", "2 - Fair", "3 - Good", "4 - Very Good", "5 - Excellent"],
        datasets: [
            {
                data: [
                    ratings.filter(r => r === 1).length || 0,
                    ratings.filter(r => r === 2).length || 0,
                    ratings.filter(r => r === 3).length || 0,
                    ratings.filter(r => r === 4).length || 0,
                    ratings.filter(r => r === 5).length || 0
                ],
                backgroundColor: ["#f44336", "#ff9800", "#ffeb3b", "#4caf50", "#2196f3"],
                hoverBackgroundColor: ["#ff7961", "#ffb74d", "#fff176", "#80e27e", "#64b5f6"]
            }
        ]
    };
    
    // Prepare data for pie chart (for feedback distribution by rating)

    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f9f9f9'
        }}>
            <h2 style={{
                textAlign: 'center',
                color: '#333'
            }}>
                Feedback Dashboard
            </h2>

            <div style={{
                width: '60%',
                margin: 'auto'
            }}>
                <h3 style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    Ratings Distribution (Bar Chart)
                </h3>
                <Bar data={ratingsDistribution} />
            </div>

            <div style={{
                width: '60%',
                margin: 'auto',
                marginTop: '30px'
            }}>
                <h3 style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    color: '#666'
                }}>
                    Feedback Ratings (Pie Chart)
                </h3>
                <Pie data={ratingsPieData} />
            </div>

            <div style={{
                marginTop: '30px'
            }}>
                <h3 style={{
                    textAlign: 'center',
                    color: '#666'
                }}>
                    Feedback Comments
                </h3>
                <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    maxWidth: '800px',
                    margin: '20px auto',
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                }}>
                    {comments.map((comment, index) => (
                        <li key={index} style={{
                            fontSize: '16px',
                            color: '#555',
                            marginBottom: '10px'
                        }}>
                            {comment}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FeedbackDashboard;
