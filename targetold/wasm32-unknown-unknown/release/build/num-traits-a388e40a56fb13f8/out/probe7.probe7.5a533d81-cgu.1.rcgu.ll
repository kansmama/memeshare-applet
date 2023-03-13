; ModuleID = 'probe7.5a533d81-cgu.1'
source_filename = "probe7.5a533d81-cgu.1"
target datalayout = "e-m:e-p:32:32-p10:8:8-p20:8:8-i64:64-n32:64-S128-ni:1:10:20"
target triple = "wasm32-unknown-unknown"

; std::f64::<impl f64>::copysign
; Function Attrs: inlinehint nounwind
define hidden double @"_ZN3std3f6421_$LT$impl$u20$f64$GT$8copysign17h237d559e362200b9E"(double %self, double %sign) unnamed_addr #0 {
start:
  %0 = alloca double, align 8
  %1 = call double @llvm.copysign.f64(double %self, double %sign)
  store double %1, ptr %0, align 8
  %2 = load double, ptr %0, align 8
  br label %bb1

bb1:                                              ; preds = %start
  ret double %2
}

; Function Attrs: nocallback nofree nosync nounwind readnone speculatable willreturn
declare hidden double @llvm.copysign.f64(double, double) #1

attributes #0 = { inlinehint nounwind "target-cpu"="generic" }
attributes #1 = { nocallback nofree nosync nounwind readnone speculatable willreturn }
