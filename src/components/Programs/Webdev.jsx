import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../AboutPage/Header';
import axios from 'axios';
import './Loading.css';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-toastify';

const Webdev = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const loading = courseLoading || studentLoading;
  const studentToken = localStorage.getItem("token");

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", education: "", programexp: "",
    course: "web-development", date: currentDate, time: currentTime,
  });

  const [resume, setResume] = useState(null);
  const warnedEmailRef = useRef('');
  const emailCheckCacheRef = useRef({ email: '', registered: false });
  const registrationToastRef = useRef(null);
  const duplicateToastRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const duplicateCheckCacheRef = useRef({ key: '', enrolled: false });
  const mountedRef = useRef(true);
  const [isBlockingToastOpen, setIsBlockingToastOpen] = useState(false);
  const overlayId = 'program-register-overlay';
  const bodyScrollAttr = 'registerScrollLock';

  const lockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (body.dataset[bodyScrollAttr] === undefined) {
      body.dataset[bodyScrollAttr] = body.style.overflow || '';
      body.style.overflow = 'hidden';
    }
  };

  const unlockBodyScroll = () => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (body.dataset[bodyScrollAttr] !== undefined) {
      body.style.overflow = body.dataset[bodyScrollAttr];
      delete body.dataset[bodyScrollAttr];
    }
  };

  const closeActiveInputs = () => {
    if (typeof document === 'undefined') return;
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') active.blur();
    setTimeout(() => {
      const refreshed = document.activeElement;
      if (refreshed && typeof refreshed.blur === 'function') refreshed.blur();
    }, 0);
  };

  const showOverlay = () => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(overlayId)) return;
    const overlay = document.createElement('div');
    overlay.id = overlayId;
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      backgroundColor: darkMode ? 'rgba(2,6,23,0.85)' : 'rgba(15,23,42,0.45)',
      backdropFilter: 'blur(6px)',
      zIndex: '9998',
      transition: 'opacity 200ms ease',
      opacity: '0',
    });
    document.activeElement?.blur?.();
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
    });
    lockBodyScroll();
    if (mountedRef.current) setIsBlockingToastOpen(true);
  };

  const hideOverlay = (afterHide) => {
    const finish = () => {
      unlockBodyScroll();
      if (mountedRef.current) setIsBlockingToastOpen(false);
      afterHide?.();
    };

    if (typeof document === 'undefined') {
      finish();
      return;
    }

    const overlay = document.getElementById(overlayId);
    if (overlay) {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.remove();
        finish();
      }, 220);
    } else {
      finish();
    }
  };

  useEffect(() => () => {
    mountedRef.current = false;
    if (typeof document !== 'undefined') {
      const overlay = document.getElementById(overlayId);
      if (overlay) overlay.remove();
    }
    unlockBodyScroll();
  }, []);

  const getToastPalette = () => (
    darkMode
      ? {
          panelClass: "bg-slate-950/90 text-slate-50",
          borderClass: "border border-white/10",
          headingClass: "text-slate-50",
          bodyClass: "text-slate-300",
          iconClass: "text-blue-300 bg-blue-500/20",
          cancelClass: "border-slate-600 text-slate-200 hover:bg-slate-900/60",
          registerGradient: "from-sky-400 via-indigo-500 to-blue-600",
          boxShadow: "0 40px 90px rgba(2,6,23,0.85)",
          panelBg: "rgba(2,6,23,0.96)",
          textColor: "#e2e8f0",
          borderColor: "1px solid rgba(255,255,255,0.08)",
        }
      : {
          panelClass: "bg-white text-slate-900",
          borderClass: "border border-slate-200",
          headingClass: "text-slate-900",
          bodyClass: "text-slate-600",
          iconClass: "text-blue-600 bg-blue-50",
          cancelClass: "border-slate-300 text-slate-700 hover:bg-slate-100",
          registerGradient: "from-blue-600 via-indigo-600 to-purple-600",
          boxShadow: "0 35px 80px rgba(15,23,42,0.18)",
          panelBg: "#ffffff",
          textColor: "#0f172a",
          borderColor: "1px solid rgba(15,23,42,0.08)",
        }
  );

  const responseIndicatesDuplicate = (payload) => {
    if (!payload) return false;
    const markers = [payload.message, payload.error];
    return markers.some((text) => typeof text === 'string' && text.toLowerCase().includes('already enrolled'));
  };

  const checkExistingEnrollment = async (emailValue, courseValue) => {
    if (duplicateToastRef.current && toast.isActive(duplicateToastRef.current)) {
      return true;
    }

    const normalizedEmail = emailValue?.trim().toLowerCase();
    const normalizedCourse = courseValue?.trim().toLowerCase();
    if (!normalizedEmail || !normalizedCourse) return false;

    const cacheKey = `${normalizedEmail}__${normalizedCourse}`;
    if (duplicateCheckCacheRef.current.key === cacheKey) {
      if (duplicateCheckCacheRef.current.enrolled) {
        showDuplicateEnrollmentToast();
      }
      return duplicateCheckCacheRef.current.enrolled;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/form/check-duplicate', {
        email: normalizedEmail,
        course: normalizedCourse,
      });
      const alreadyEnrolled = !!data?.enrolled;
      duplicateCheckCacheRef.current = { key: cacheKey, enrolled: alreadyEnrolled };
      if (alreadyEnrolled) {
        showDuplicateEnrollmentToast();
      }
      return alreadyEnrolled;
    } catch (error) {
      console.error('Duplicate enrollment check failed:', error?.response?.data || error.message);
      return false;
    }
  };

  const showDuplicateEnrollmentToast = () => {
    if (duplicateToastRef.current && toast.isActive(duplicateToastRef.current)) return;
    const palette = getToastPalette();

    closeActiveInputs();
    showOverlay();
    const toastId = toast.info(
      <div className="w-full flex flex-col items-center gap-4 px-8 py-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/30 shadow-lg shadow-emerald-900/30">
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 ${palette.iconClass}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        <div className="space-y-1">
          <h3 className={`text-2xl font-semibold tracking-tight ${palette.headingClass}`}>You're already registered</h3>
          <p className={`text-base leading-relaxed ${palette.bodyClass}`}>
            Good news—you've already applied for this program. Explore more learning paths while we keep this one saved for you.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastId);
              hideOverlay();
            }}
            className={`rounded-full border px-6 py-2.5 text-sm font-semibold transition ${palette.cancelClass}`}
          >
            Okay
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastId);
              hideOverlay(() => navigate('/programs'));
            }}
            className={`rounded-full bg-gradient-to-r ${palette.registerGradient} px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:scale-[1.03]`}
          >
            Explore Programs
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        icon: false,
        position: 'top-center',
        className: `${palette.panelClass} ${palette.borderClass} backdrop-blur-2xl rounded-[30px] px-0 py-0`,
        bodyClassName: 'w-full flex justify-center',
        style: {
          margin: '0 auto',
          marginTop: '16vh',
          width: 'min(92vw, 560px)',
          minHeight: '220px',
          boxShadow: palette.boxShadow,
          backgroundColor: palette.panelBg,
          color: palette.textColor,
          border: palette.borderColor,
        },
        onClose: () => {
          hideOverlay();
          duplicateToastRef.current = null;
        },
      }
    );

    duplicateToastRef.current = toastId;
  };

  const promptRegistration = (email = '') => {
    if (
      warnedEmailRef.current === email &&
      registrationToastRef.current &&
      toast.isActive(registrationToastRef.current)
    ) {
      return;
    }

    let toastId;
    closeActiveInputs();
    showOverlay();
    const palette = getToastPalette();

    toastId = toast.info(
      <div className="w-full flex flex-col items-center gap-6 px-10 py-12 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/25 to-indigo-600/30 shadow-lg shadow-blue-900/30">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 ${palette.iconClass}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
            >
              <path d="M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path d="M5 19a6 6 0 1 1 12 0" />
              <path d="M19 8v4" />
              <path d="M21 10h-4" />
            </svg>
          </span>
        </span>
        <div className="space-y-2 max-w-xl">
          <h3 className={`text-3xl font-semibold tracking-tight ${palette.headingClass}`}>Register Required</h3>
          <p className={`text-base leading-relaxed ${palette.bodyClass}`}>
            To apply for this program you need an UpToSkills account. Create one now so we can save your application progress and keep you posted about your status.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastId);
              hideOverlay();
            }}
            className={`rounded-full border px-7 py-3 text-sm font-semibold transition ${palette.cancelClass}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              toast.dismiss(toastId);
              hideOverlay(() => navigate('/register'));
            }}
            className={`rounded-full bg-gradient-to-r ${palette.registerGradient} px-9 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:scale-[1.03]`}
          >
            Go to Register
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        icon: false,
        position: "top-center",
        className: `${palette.panelClass} ${palette.borderClass} backdrop-blur-2xl rounded-[36px] px-0 py-0`,
        bodyClassName: "w-full flex justify-center",
        style: {
          margin: '0 auto',
          marginTop: '14vh',
          width: 'min(92vw, 720px)',
          minHeight: '300px',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: palette.boxShadow,
          backgroundColor: palette.panelBg,
          color: palette.textColor,
          border: palette.borderColor,
        },
        onClose: () => {
          hideOverlay();
          registrationToastRef.current = null;
        },
      }
    );

    warnedEmailRef.current = email;
    registrationToastRef.current = toastId;
  };

  const verifyEmailRegistration = async (rawEmail, { redirect = true } = {}) => {
    const normalizedEmail = rawEmail?.trim().toLowerCase();
    if (!normalizedEmail) return false;

    if (emailCheckCacheRef.current.email === normalizedEmail) {
      if (!emailCheckCacheRef.current.registered && redirect) {
        promptRegistration(normalizedEmail);
      } else if (emailCheckCacheRef.current.registered) {
        hideOverlay();
      }
      return emailCheckCacheRef.current.registered;
    }

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/check-email', { email: normalizedEmail });
      const isRegistered = !!data?.registered;
      emailCheckCacheRef.current = { email: normalizedEmail, registered: isRegistered };

      if (!isRegistered && redirect) {
        promptRegistration(normalizedEmail);
      } else if (isRegistered && registrationToastRef.current) {
        toast.dismiss(registrationToastRef.current);
        registrationToastRef.current = null;
        hideOverlay();
      } else if (isRegistered) {
        hideOverlay();
      }

      if (isRegistered) {
        checkExistingEnrollment(normalizedEmail, formData.course);
      }

      return isRegistered;
    } catch (error) {
      console.error('Email verification failed:', error?.response?.data || error.message);
      if (error?.response?.status === 400) {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error('Unable to verify email right now. Please try again.');
      }
      return false;
    }
  };

  const handleEmailBlur = async (event) => {
    const emailValue = event.target.value;
    if (!emailValue) return;
    await verifyEmailRegistration(emailValue);
  };

  useEffect(() => {
    const getCourse = async () => {
      try {
        const req = await axios.get(`http://localhost:5000/api/courses/getbyid/${id}`);
        if (req.data.length === 0) { setError("Course not found"); }
        else { setCourse(req.data[0]); setFormData(prev => ({ ...prev, course: req.data[0].title })); }
      } catch (err) { console.error("Error fetching course:", err); setError("Failed to fetch course."); }
      finally { setCourseLoading(false); }
    };

    const getStudent = async () => {
      if (!studentToken) { setStudentLoading(false); return; }

      const trimmedToken = studentToken.replace(/^["']|["']$/g, '').trim();
      const looksLikeJwt = trimmedToken.split('.').length === 3;
      if (!trimmedToken || trimmedToken === 'dummy_admin_token' || !looksLikeJwt) {
        setStudentLoading(false);
        return;
      }
      setStudentLoading(true);
      try {
        const authHeader = trimmedToken.startsWith('Bearer ')
          ? trimmedToken
          : `Bearer ${trimmedToken}`;
        const res = await axios.get(`http://localhost:5000/api/auth/getStudent`, { headers: { Authorization: authHeader } });
        setStudent(res.data);
        setFormData(prev => ({ ...prev, name: res.data.name || "", email: res.data.email || "", phone: res.data.phone || "" }));
      } catch (err) {
        console.error("Error fetching student:", err);
        if (err?.response?.status === 401) {
          localStorage.removeItem('token');
        }
      }
      finally { setStudentLoading(false); }
    };
    getCourse(); getStudent();
  }, [id, studentToken]);


  const enrollStudent = async (studentId) => {
    if (!student) { navigate('/login'); return; }
    try {
      await axios.put(`http://localhost:5000/api/courses/enrollstudent/${id}`, { studentId });
    } catch (err) {
      console.error('Enrollment failed:', err);
      throw err;
    }
  };

  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') { alert('Please upload a PDF file.'); e.target.value = null; setResume(null); return; }
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const isRegistered = await verifyEmailRegistration(formData.email);
    if (!isRegistered) {
      setIsSubmitting(false);
      return;
    }
    const alreadyEnrolled = await checkExistingEnrollment(formData.email, formData.course);
    if (alreadyEnrolled) {
      setIsSubmitting(false);
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (resume) data.append('resume', resume);
      const submissionResponse = await axios.post('http://localhost:5000/api/form', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (responseIndicatesDuplicate(submissionResponse?.data)) {
        showDuplicateEnrollmentToast();
        return;
      }

      const serverEnrollment = submissionResponse?.data?.enrollment;
      const wasEnrollmentHandledServerSide = Boolean(serverEnrollment?.id);

      if (student?.id && !wasEnrollmentHandledServerSide) {
        try {
          await enrollStudent(student.id);
        } catch (err) {
          const duplicate = err?.response?.data?.message?.toLowerCase?.().includes('already enrolled');
          if (duplicate) {
            showDuplicateEnrollmentToast();
            return;
          }
          throw err;
        }
      }
      window.location.href = '/thankyou';
    } catch (error) {
      const duplicate = responseIndicatesDuplicate(error?.response?.data);
      if (duplicate) {
        showDuplicateEnrollmentToast();
      } else {
        console.error('Upload failed:', error.response?.data || error.message);
        toast.error('Unable to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = `peer w-full border-2 rounded-xl px-4 pt-5 pb-2 transition-all outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"} focus:ring-2 focus:ring-blue-200`;
  const labelClass = `absolute text-sm left-4 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500 ${darkMode ? "text-gray-400 peer-placeholder-shown:text-gray-500" : "text-gray-500 peer-placeholder-shown:text-gray-400"}`;
  const selectClass = `w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"} focus:ring-2 focus:ring-blue-200`;
  const labelTextClass = `block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-[#eef2ff] via-white to-[#dbeafe]"}`}>
      <div className="text-center">
        {loading ? (
          <div className="min-h-screen flex flex-col">
            <Header className="items-center" />
            <main className="flex-1 flex items-center justify-center"><div className="loader"></div></main>
          </div>
        ) : (
          <div className={`min-h-screen flex flex-col relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-[#eef2ff] via-white to-[#dbeafe]"}`}>
            <div className={`absolute top-[-100px] left-[-100px] w-[300px] h-[300px] blur-3xl rounded-full animate-pulse ${darkMode ? "bg-blue-600/20" : "bg-blue-400/30"}`}></div>
            <div className={`absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] blur-3xl rounded-full animate-pulse ${darkMode ? "bg-indigo-600/20" : "bg-indigo-400/30"}`}></div>
            <Header />
            <div>
              <main className="flex-grow pb-20 relative z-10">
                <div className="text-center mt-28 mb-12 px-4">
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">{course?.title}</h1>
                  <p className={`max-w-3xl mx-auto text-lg leading-relaxed mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{course?.description}</p>
                  <p className="text-lg font-semibold text-indigo-500">Join us and unlock the world of modern {course?.title}.</p>
                </div>

                <div className={`max-w-4xl mx-auto text-start backdrop-blur-md rounded-2xl p-6 shadow-lg mb-12 transform transition hover:scale-[1.01] ${darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-blue-100"} border`}>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    <span className="font-bold text-blue-500">Skills:</span> {course?.skills?.length > 0 ? course.skills.join(', ') : "No skills listed"}
                  </p>
                </div>

                <div className="grid place-items-center text-start px-4">
                  <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl"
                    style={isBlockingToastOpen ? { pointerEvents: 'none', userSelect: 'none' } : undefined}
                  >
                    <div className={`backdrop-blur-md p-10 rounded-3xl shadow-2xl transition-all duration-300 ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-blue-100"} border hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)]`}>
                      <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>Apply for {course?.title}</h2>
                      <div className="space-y-6">
                        <div className="relative">
                          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" " required className={inputClass} />
                          <label className={labelClass}>Full Name</label>
                        </div>
                        <div className="relative">
                          <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} placeholder=" " required className={inputClass} />
                          <label className={labelClass}>Email Address</label>
                        </div>
                        <div className="relative">
                          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " required className={inputClass} />
                          <label className={labelClass}>Phone Number</label>
                        </div>
                        <div>
                          <label className={labelTextClass}>Education Level</label>
                          <select name="education" value={formData.education} onChange={handleChange} required className={selectClass}>
                            <option value="">Select your education level</option>
                            <option value="high-school">High School</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="bachelor's-degree">Bachelor's Degree</option>
                            <option value="master's-degree">Master's Degree</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelTextClass}>Programming Experience</label>
                          <select name="programexp" value={formData.programexp} onChange={handleChange} required className={selectClass}>
                            <option value="">Select your experience level</option>
                            <option value="none">No Experience</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelTextClass}>Course</label>
                          <div className={selectClass}>{course?.title}</div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isBlockingToastOpen || isSubmitting}
                        aria-busy={isSubmitting}
                        className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.03] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" d="M4 12a8 8 0 0 1 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                            <span>Submitting...</span>
                          </span>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
      <footer className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${darkMode ? "bg-gray-950 text-gray-300 border-gray-700" : "bg-gray-700 text-gray-100 border-gray-300"}`}>
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>
    </div>
  );
};

export default Webdev;
