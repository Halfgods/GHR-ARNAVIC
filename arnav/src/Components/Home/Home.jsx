import React from 'react'
import '../../CSS/Home.css'
import video from '../../Assets/video.mp4'
import { Link } from 'react-router'

const Home = () => {
    return (
        <section className="bg-white text-slate-900 font-body overflow-x-hidden">
            <div className="fixed inset-0 pointer-events-none z-0 transition-transform duration-100 ease-out will-change-transform" id="grid-background">
                <video className="absolute inset-0 w-full h-full opacity-60 object-cover" autoPlay muted loop playsInline>
                    <source src={video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 grid-bg"></div>
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            <nav className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <span className="material-symbols-outlined text-primary text-3xl">layers</span>
                            <span className="font-display font-bold text-xl tracking-tight text-slate-900">ARNavic</span>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <a href="auth-modal.html">
                                <button className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-600 hover:text-primary transition-all duration-200">
                                    Login
                                </button>
                            </a>
                            <button className="px-5 py-2.5 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-all duration-200">
                                Try Demo
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="relative z-10 pt-32 pb-20">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-primary/30 bg-white shadow-sm mb-8 hover:border-primary/60 transition-colors cursor-default">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse mr-2"></span>
                        <span className="text-[10px] sm:text-xs font-bold tracking-widest text-primary uppercase font-display">AR-Powered Indoor Navigation</span>
                    </div>
                    <h1 className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.1] tracking-tight text-slate-900 max-w-4xl mb-6">
                        Navigate
                        <span className="text-gradient animate-gradient bg-[length:200%_auto]">Any Building</span>
                        <br className="hidden sm:block" />
                        in AR
                    </h1>
                    <p className="font-body text-slate-500 text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed">
                        Seamlessly guide visitors through complex spaces with precision indoor wayfinding. No hardware required.
                    </p>
                    <div>
                        <button className="flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-gradient-brand text-white font-medium text-base sm:text-lg tracking-wide shadow-glow hover:shadow-glow-hover hover:scale-105 transition-all duration-300">
                            <span className="material-symbols-outlined">qr_code_scanner</span>
                            <Link to="/qr">
                                <span>Start Scanning</span>
                            </Link>
                        </button>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <div className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-transparent hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-primary text-2xl">visibility</span>
                            </div>
                            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Visual Positioning</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Instantly localize users within centimeters using just their camera feed. No beacons or wifi triangulation needed.
                            </p>
                        </div>
                        <div className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-transparent hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-primary text-2xl">route</span>
                            </div>
                            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Dynamic Pathfinding</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Real-time 3D arrows anchored to the floor guide visitors to their destination with turn-by-turn precision.
                            </p>
                        </div>
                        <div className="group p-6 bg-white border border-slate-100 rounded-2xl hover:border-transparent hover:shadow-card hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                <span className="material-symbols-outlined text-primary text-2xl">view_in_ar</span>
                            </div>
                            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">Digital Layer</h3>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Overlay points of interest, room availability, and safety alerts directly onto the physical world.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </section>
    )
}

export default Home