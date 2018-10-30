// Generated with /tools/extend_type_gen/main.js
import { Next } from './methods'
import { States, Keys } from './queries'
export interface Extend<T0 extends Keys> {
extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1
  >(
    q1: Q1
  ): Next<T0 & Keys, S1>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2
  >(
    q1: Q1, q2: Q2
  ): Next<T1 & Keys, S2>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3
  >(
    q1: Q1, q2: Q2, q3: Q3
  ): Next<T2 & Keys, S3>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4
  ): Next<T3 & Keys, S4>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5
  ): Next<T4 & Keys, S5>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6
  ): Next<T5 & Keys, S6>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7
  ): Next<T6 & Keys, S7>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8
  ): Next<T7 & Keys, S8>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9
  ): Next<T8 & Keys, S9>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10
  ): Next<T9 & Keys, S10>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11
  ): Next<T10 & Keys, S11>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12
  ): Next<T11 & Keys, S12>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13
  ): Next<T12 & Keys, S13>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14
  ): Next<T13 & Keys, S14>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15
  ): Next<T14 & Keys, S15>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16
  ): Next<T15 & Keys, S16>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17
  ): Next<T16 & Keys, S17>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18
  ): Next<T17 & Keys, S18>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19
  ): Next<T18 & Keys, S19>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20
  ): Next<T19 & Keys, S20>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21
  ): Next<T20 & Keys, S21>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22
  ): Next<T21 & Keys, S22>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23
  ): Next<T22 & Keys, S23>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24
  ): Next<T23 & Keys, S24>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24,
    Q25, S25 extends States<Q25>, T25 extends T24 & S25
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
    q25: Q25
  ): Next<T24 & Keys, S25>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24,
    Q25, S25 extends States<Q25>, T25 extends T24 & S25,
    Q26, S26 extends States<Q26>, T26 extends T25 & S26
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
    q25: Q25, q26: Q26
  ): Next<T25 & Keys, S26>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24,
    Q25, S25 extends States<Q25>, T25 extends T24 & S25,
    Q26, S26 extends States<Q26>, T26 extends T25 & S26,
    Q27, S27 extends States<Q27>, T27 extends T26 & S27
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
    q25: Q25, q26: Q26, q27: Q27
  ): Next<T26 & Keys, S27>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24,
    Q25, S25 extends States<Q25>, T25 extends T24 & S25,
    Q26, S26 extends States<Q26>, T26 extends T25 & S26,
    Q27, S27 extends States<Q27>, T27 extends T26 & S27,
    Q28, S28 extends States<Q28>, T28 extends T27 & S28
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
    q25: Q25, q26: Q26, q27: Q27, q28: Q28
  ): Next<T27 & Keys, S28>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24,
    Q25, S25 extends States<Q25>, T25 extends T24 & S25,
    Q26, S26 extends States<Q26>, T26 extends T25 & S26,
    Q27, S27 extends States<Q27>, T27 extends T26 & S27,
    Q28, S28 extends States<Q28>, T28 extends T27 & S28,
    Q29, S29 extends States<Q29>, T29 extends T28 & S29
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
    q25: Q25, q26: Q26, q27: Q27, q28: Q28, q29: Q29
  ): Next<T28 & Keys, S29>
  
  extend<
    Q1, S1 extends States<Q1>, T1 extends T0 & S1,
    Q2, S2 extends States<Q2>, T2 extends T1 & S2,
    Q3, S3 extends States<Q3>, T3 extends T2 & S3,
    Q4, S4 extends States<Q4>, T4 extends T3 & S4,
    Q5, S5 extends States<Q5>, T5 extends T4 & S5,
    Q6, S6 extends States<Q6>, T6 extends T5 & S6,
    Q7, S7 extends States<Q7>, T7 extends T6 & S7,
    Q8, S8 extends States<Q8>, T8 extends T7 & S8,
    Q9, S9 extends States<Q9>, T9 extends T8 & S9,
    Q10, S10 extends States<Q10>, T10 extends T9 & S10,
    Q11, S11 extends States<Q11>, T11 extends T10 & S11,
    Q12, S12 extends States<Q12>, T12 extends T11 & S12,
    Q13, S13 extends States<Q13>, T13 extends T12 & S13,
    Q14, S14 extends States<Q14>, T14 extends T13 & S14,
    Q15, S15 extends States<Q15>, T15 extends T14 & S15,
    Q16, S16 extends States<Q16>, T16 extends T15 & S16,
    Q17, S17 extends States<Q17>, T17 extends T16 & S17,
    Q18, S18 extends States<Q18>, T18 extends T17 & S18,
    Q19, S19 extends States<Q19>, T19 extends T18 & S19,
    Q20, S20 extends States<Q20>, T20 extends T19 & S20,
    Q21, S21 extends States<Q21>, T21 extends T20 & S21,
    Q22, S22 extends States<Q22>, T22 extends T21 & S22,
    Q23, S23 extends States<Q23>, T23 extends T22 & S23,
    Q24, S24 extends States<Q24>, T24 extends T23 & S24,
    Q25, S25 extends States<Q25>, T25 extends T24 & S25,
    Q26, S26 extends States<Q26>, T26 extends T25 & S26,
    Q27, S27 extends States<Q27>, T27 extends T26 & S27,
    Q28, S28 extends States<Q28>, T28 extends T27 & S28,
    Q29, S29 extends States<Q29>, T29 extends T28 & S29,
    Q30, S30 extends States<Q30>, T30 extends T29 & S30
  >(
    q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, 
    q9: Q9, q10: Q10, q11: Q11, q12: Q12, q13: Q13, q14: Q14, q15: Q15, q16: Q16, 
    q17: Q17, q18: Q18, q19: Q19, q20: Q20, q21: Q21, q22: Q22, q23: Q23, q24: Q24, 
    q25: Q25, q26: Q26, q27: Q27, q28: Q28, q29: Q29, q30: Q30,
    ...queries: Q30[]
  ): Next<T29 & Keys, S30>
}
