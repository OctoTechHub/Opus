import React from 'react';
import Gryffindor from "../Images/Gryffindor.jpeg";
import Slytherin from "../Images/Slytherin.jpeg";
import RavenClaw from "../Images/RavenClaw.jpeg";
import Hufflepuff from "../Images/Hufflepuff.jpeg";
import logo from ".././../../public/android-chrome-512x512.png";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useLocation, useNavigate } from 'react-router-dom';

const Invoice = () => {
    const location=useLocation();
    const navigate=useNavigate();
    const { publickey, blockid, transactionhash, team } = location.state;
    let teamImage;
    switch (team) {
        case 'Gryffindor':
            teamImage = Gryffindor;
            break;
        case 'Slytherin':
            teamImage = Slytherin;
            break;
        case 'RavenClaw':
            teamImage = RavenClaw;
            break;
        case 'Hufflepuff':
            teamImage = Hufflepuff;
            break;
        default:
            teamImage = '';
            break;
    }

    const downloadPdf = () => {
        const input = document.getElementById('invoice');
        if (input) {
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            });
        }
    };

    return (
        <div className='flex items-center font-mono flex-col justify-center bg-gradient-to-br from-gray-800 to-black  text-black relative'>
            <button className='absolute top-0 rounded-lg bg-orange-500 left-0 mx-3 my-5 px-4 py-5  font-bold' onClick={()=>{
                navigate('/buyLand')
            }}>Back</button>
            <img src={logo} alt="Logo" className="absolute top-0 rounded-full right-0 w-20 h-20" />
            <div className='flex flex-col items-center h-screen'>
                <table id='invoice' className='table max-h-60 mt-40 text-center border-4 bg-white border-black font-mono text-2xl'>
                    <tbody>
                        <tr>
                            <td className='border px-4 py-2' colSpan={2}>
                                <img src={teamImage} alt={`${team}`} className="w-60 h-60 mx-auto rounded-2xl" />
                            </td>
                        </tr>
                        <tr>
                            <td className='border px-4 py-2 font-extrabold'>Public Key</td>
                            <td className='border px-4 py-2 font-semibold'>{publickey}</td>
                        </tr>
                        <tr>
                            <td className='border px-4 py-2 font-extrabold'>Block ID</td>
                            <td className='border px-4 py-2 font-semibold'>{blockid}</td>
                        </tr>
                        <tr>
                            <td className='border px-4 py-2 font-extrabold'>Transaction Hash</td>
                            <td className='border px-4 py-2 font-semibold'>{transactionhash}</td>
                        </tr>
                        <tr>
                            <td className='border px-4 py-2 font-extrabold'>Team</td>
                            <td className='border px-4 py-2 font-semibold'>{team}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={downloadPdf} className='px-4 py-2 mt-4 bg-orange-500 hover:bg-orange-700 text-white rounded-lg'>
                    DOWNLOAD
                </button>
            </div>
        </div>
    );
};

export default Invoice;
