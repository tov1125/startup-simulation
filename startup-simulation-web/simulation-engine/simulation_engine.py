"""
창업 시뮬레이션 엔진
고객 페르소나 생성, 가설 검증, 시장 분석을 수행합니다.
"""

import random
import json
from typing import List, Dict, Any, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import numpy as np
from datetime import datetime

class CustomerSegment(Enum):
    """고객 세그먼트 분류"""
    INNOVATOR = "혁신자"  # 2.5%
    EARLY_ADOPTER = "얼리어답터"  # 13.5%
    EARLY_MAJORITY = "초기 다수"  # 34%
    LATE_MAJORITY = "후기 다수"  # 34%
    LAGGARD = "지각 수용자"  # 16%

class ResponseSentiment(Enum):
    """응답 감정 분류"""
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"

@dataclass
class CustomerPersona:
    """고객 페르소나 모델"""
    id: str
    name: str
    age: int
    gender: str
    occupation: str
    income_range: str
    segment: CustomerSegment
    pain_points: List[str]
    needs: List[str]
    tech_savviness: int  # 1-10
    price_sensitivity: int  # 1-10
    brand_loyalty: int  # 1-10
    social_influence: int  # 1-10

@dataclass
class InterviewResponse:
    """인터뷰 응답 모델"""
    question: str
    answer: str
    sentiment: ResponseSentiment
    confidence: float
    keywords: List[str]

@dataclass
class HypothesisResult:
    """가설 검증 결과"""
    hypothesis: str
    validation_status: str  # validated, invalidated, partial
    confidence_score: float
    supporting_evidence: List[str]
    contrary_evidence: List[str]
    recommendations: List[str]
    pivot_suggestions: List[str]

class SimulationEngine:
    """시뮬레이션 엔진 클래스"""
    
    def __init__(self, bmc_data: Dict, market_data: Dict = None):
        self.bmc_data = bmc_data
        self.market_data = market_data or self._get_default_market_data()
        self.personas: List[CustomerPersona] = []
        self.interview_results: Dict[str, List[InterviewResponse]] = {}
        
    def _get_default_market_data(self) -> Dict:
        """기본 시장 데이터 생성"""
        return {
            "market_size": 1000000000000,  # 1조원
            "growth_rate": 15.0,
            "competition_level": "medium",
            "entry_barriers": ["brand_recognition", "switching_cost", "network_effect"],
            "customer_acquisition_cost": 50000,
            "lifetime_value": 300000,
        }
    
    def generate_personas(self, count: int = 10) -> List[CustomerPersona]:
        """고객 페르소나 생성"""
        
        # 한국 이름 풀
        last_names = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"]
        first_names_male = ["민준", "서준", "도윤", "예준", "시우", "하준", "주원", "지호", "지후", "준서"]
        first_names_female = ["서연", "서윤", "지우", "서현", "민서", "하은", "하윤", "지유", "윤서", "채원"]
        
        # 직업 풀
        occupations = [
            "스타트업 개발자", "마케팅 매니저", "프리랜서 디자이너", 
            "중소기업 팀장", "대기업 사원", "학생", "자영업자",
            "컨설턴트", "연구원", "교사"
        ]
        
        # 소득 구간
        income_ranges = [
            "2000만원 이하", "2000-3000만원", "3000-4000만원",
            "4000-5000만원", "5000-7000만원", "7000만원-1억원", "1억원 이상"
        ]
        
        personas = []
        segment_distribution = [0.025, 0.135, 0.34, 0.34, 0.16]  # Rogers' Innovation Adoption Curve
        
        for i in range(count):
            # 세그먼트 결정
            segment_roll = random.random()
            cumulative = 0
            segment_idx = 0
            for idx, prob in enumerate(segment_distribution):
                cumulative += prob
                if segment_roll < cumulative:
                    segment_idx = idx
                    break
            
            segment = list(CustomerSegment)[segment_idx]
            
            # 성별과 이름 결정
            gender = random.choice(["남성", "여성"])
            if gender == "남성":
                first_name = random.choice(first_names_male)
            else:
                first_name = random.choice(first_names_female)
            
            name = random.choice(last_names) + first_name
            
            # 나이 (세그먼트에 따라 다른 분포)
            if segment == CustomerSegment.INNOVATOR:
                age = int(np.random.normal(28, 5))
            elif segment == CustomerSegment.EARLY_ADOPTER:
                age = int(np.random.normal(32, 6))
            else:
                age = int(np.random.normal(38, 8))
            age = max(20, min(65, age))  # 20-65세로 제한
            
            # 특성 점수 (세그먼트에 따라 조정)
            if segment in [CustomerSegment.INNOVATOR, CustomerSegment.EARLY_ADOPTER]:
                tech_savviness = random.randint(7, 10)
                price_sensitivity = random.randint(3, 7)
                brand_loyalty = random.randint(2, 6)
                social_influence = random.randint(6, 10)
            elif segment in [CustomerSegment.EARLY_MAJORITY, CustomerSegment.LATE_MAJORITY]:
                tech_savviness = random.randint(4, 7)
                price_sensitivity = random.randint(5, 9)
                brand_loyalty = random.randint(5, 8)
                social_influence = random.randint(4, 7)
            else:  # LAGGARD
                tech_savviness = random.randint(1, 4)
                price_sensitivity = random.randint(7, 10)
                brand_loyalty = random.randint(6, 10)
                social_influence = random.randint(2, 5)
            
            # Pain points와 needs 생성
            pain_points = self._generate_pain_points()
            needs = self._generate_needs()
            
            persona = CustomerPersona(
                id=f"persona_{i+1}",
                name=name,
                age=age,
                gender=gender,
                occupation=random.choice(occupations),
                income_range=random.choice(income_ranges),
                segment=segment,
                pain_points=random.sample(pain_points, k=random.randint(2, 4)),
                needs=random.sample(needs, k=random.randint(2, 4)),
                tech_savviness=tech_savviness,
                price_sensitivity=price_sensitivity,
                brand_loyalty=brand_loyalty,
                social_influence=social_influence
            )
            
            personas.append(persona)
        
        self.personas = personas
        return personas
    
    def _generate_pain_points(self) -> List[str]:
        """Pain points 생성"""
        return [
            "업무 효율성 저하",
            "협업 도구의 분산",
            "데이터 관리 어려움",
            "커뮤니케이션 단절",
            "반복적인 수작업",
            "비용 증가",
            "시간 낭비",
            "정보 접근성 부족",
            "품질 관리 어려움",
            "확장성 부족"
        ]
    
    def _generate_needs(self) -> List[str]:
        """Needs 생성"""
        return [
            "통합 관리 솔루션",
            "자동화 기능",
            "실시간 협업",
            "데이터 분석",
            "모바일 접근성",
            "사용자 친화적 인터페이스",
            "보안 강화",
            "커스터마이징 옵션",
            "합리적 가격",
            "빠른 고객 지원"
        ]
    
    def conduct_interviews(self, persona: CustomerPersona, questions: List[str]) -> List[InterviewResponse]:
        """가상 인터뷰 수행"""
        responses = []
        
        for question in questions:
            # 질문 유형 분석
            question_lower = question.lower()
            
            # 가격 관련 질문
            if "가격" in question_lower or "비용" in question_lower or "구독" in question_lower:
                response = self._generate_price_response(persona, question)
            # 기능 관련 질문
            elif "기능" in question_lower or "특징" in question_lower:
                response = self._generate_feature_response(persona, question)
            # 경쟁사 관련 질문
            elif "경쟁" in question_lower or "비교" in question_lower:
                response = self._generate_competition_response(persona, question)
            # 마케팅 채널 관련 질문
            elif "어떻게" in question_lower and "알게" in question_lower:
                response = self._generate_discovery_response(persona, question)
            else:
                response = self._generate_general_response(persona, question)
            
            responses.append(response)
        
        self.interview_results[persona.id] = responses
        return responses
    
    def _generate_price_response(self, persona: CustomerPersona, question: str) -> InterviewResponse:
        """가격 관련 응답 생성"""
        
        if persona.price_sensitivity > 7:
            sentiment = ResponseSentiment.NEGATIVE
            answers = [
                "가격이 부담스러워요. 더 저렴한 대안을 찾고 있습니다.",
                "무료 버전이나 체험판을 먼저 써보고 싶네요.",
                "현재 예산으로는 어려울 것 같습니다."
            ]
            confidence = 0.3
        elif persona.price_sensitivity > 4:
            sentiment = ResponseSentiment.NEUTRAL
            answers = [
                "가치가 명확하다면 고려해볼 수 있습니다.",
                "경쟁사와 비교해보고 결정하겠습니다.",
                "팀과 상의가 필요할 것 같아요."
            ]
            confidence = 0.6
        else:
            sentiment = ResponseSentiment.POSITIVE
            answers = [
                "합리적인 가격이라고 생각합니다.",
                "제공되는 가치를 고려하면 적절한 것 같아요.",
                "투자할 가치가 있다고 봅니다."
            ]
            confidence = 0.8
        
        return InterviewResponse(
            question=question,
            answer=random.choice(answers),
            sentiment=sentiment,
            confidence=confidence,
            keywords=["가격", "비용", "예산", "가치"]
        )
    
    def _generate_feature_response(self, persona: CustomerPersona, question: str) -> InterviewResponse:
        """기능 관련 응답 생성"""
        
        if persona.tech_savviness > 7:
            answers = [
                "고급 기능과 커스터마이징 옵션이 중요합니다.",
                "API 연동과 자동화 기능이 필수적이에요.",
                "데이터 분석과 인사이트 기능을 중시합니다."
            ]
            sentiment = ResponseSentiment.POSITIVE
        else:
            answers = [
                "사용하기 쉬운 인터페이스가 가장 중요해요.",
                "기본 기능만 잘 작동하면 됩니다.",
                "복잡한 기능보다는 안정성이 중요합니다."
            ]
            sentiment = ResponseSentiment.NEUTRAL
        
        return InterviewResponse(
            question=question,
            answer=random.choice(answers),
            sentiment=sentiment,
            confidence=0.7,
            keywords=["기능", "인터페이스", "사용성"]
        )
    
    def _generate_competition_response(self, persona: CustomerPersona, question: str) -> InterviewResponse:
        """경쟁사 관련 응답 생성"""
        
        if persona.brand_loyalty > 7:
            answers = [
                "현재 사용 중인 도구에 만족하고 있어서 바꾸기 어려워요.",
                "전환 비용과 학습 곡선을 고려해야 합니다.",
                "팀원들의 적응 기간이 걱정됩니다."
            ]
            sentiment = ResponseSentiment.NEGATIVE
        else:
            answers = [
                "더 나은 솔루션이라면 언제든 전환할 의향이 있습니다.",
                "차별화된 가치가 있다면 시도해볼 만해요.",
                "경쟁사 대비 장점이 명확하네요."
            ]
            sentiment = ResponseSentiment.POSITIVE
        
        return InterviewResponse(
            question=question,
            answer=random.choice(answers),
            sentiment=sentiment,
            confidence=0.6,
            keywords=["경쟁", "차별화", "전환"]
        )
    
    def _generate_discovery_response(self, persona: CustomerPersona, question: str) -> InterviewResponse:
        """발견 채널 관련 응답 생성"""
        
        if persona.age < 30:
            channels = ["인스타그램", "유튜브", "링크드인", "페이스북"]
        elif persona.age < 40:
            channels = ["구글 검색", "동료 추천", "업계 커뮤니티", "웨비나"]
        else:
            channels = ["업계 전문지", "컨퍼런스", "파트너사 소개", "이메일 뉴스레터"]
        
        answer = f"{random.choice(channels)}을(를) 통해 알게 되었습니다."
        
        return InterviewResponse(
            question=question,
            answer=answer,
            sentiment=ResponseSentiment.NEUTRAL,
            confidence=0.8,
            keywords=["마케팅", "채널", "발견"]
        )
    
    def _generate_general_response(self, persona: CustomerPersona, question: str) -> InterviewResponse:
        """일반 응답 생성"""
        
        answers = [
            "흥미로운 제안입니다. 더 자세히 알아보고 싶네요.",
            "우리 팀의 니즈와 잘 맞는 것 같습니다.",
            "몇 가지 추가 질문이 있습니다."
        ]
        
        return InterviewResponse(
            question=question,
            answer=random.choice(answers),
            sentiment=ResponseSentiment.NEUTRAL,
            confidence=0.5,
            keywords=["일반", "관심"]
        )
    
    def validate_hypothesis(self, hypothesis: str, threshold: float = 0.6) -> HypothesisResult:
        """가설 검증"""
        
        supporting = []
        contrary = []
        total_confidence = 0
        response_count = 0
        
        # 모든 인터뷰 응답 분석
        for persona_id, responses in self.interview_results.items():
            persona = next((p for p in self.personas if p.id == persona_id), None)
            if not persona:
                continue
            
            for response in responses:
                # 가설과 관련된 응답 찾기
                if any(keyword in hypothesis.lower() for keyword in response.keywords):
                    response_count += 1
                    
                    if response.sentiment == ResponseSentiment.POSITIVE:
                        supporting.append(f"{persona.name} ({persona.segment.value}): {response.answer}")
                        total_confidence += response.confidence
                    elif response.sentiment == ResponseSentiment.NEGATIVE:
                        contrary.append(f"{persona.name} ({persona.segment.value}): {response.answer}")
                        total_confidence += (1 - response.confidence)
                    else:
                        total_confidence += 0.5
        
        # 신뢰도 계산
        if response_count > 0:
            confidence_score = total_confidence / response_count
        else:
            confidence_score = 0.5
        
        # 검증 상태 결정
        if confidence_score > threshold:
            validation_status = "validated"
        elif confidence_score < (1 - threshold):
            validation_status = "invalidated"
        else:
            validation_status = "partial"
        
        # 권장사항 생성
        recommendations = self._generate_recommendations(validation_status, confidence_score)
        pivot_suggestions = self._generate_pivot_suggestions(validation_status, contrary)
        
        return HypothesisResult(
            hypothesis=hypothesis,
            validation_status=validation_status,
            confidence_score=confidence_score,
            supporting_evidence=supporting[:5],  # 상위 5개만
            contrary_evidence=contrary[:5],  # 상위 5개만
            recommendations=recommendations,
            pivot_suggestions=pivot_suggestions
        )
    
    def _generate_recommendations(self, status: str, confidence: float) -> List[str]:
        """권장사항 생성"""
        
        if status == "validated":
            return [
                "현재 방향성을 유지하되 세부 실행 계획을 구체화하세요",
                "얼리어답터 그룹을 대상으로 베타 테스트를 진행하세요",
                "마케팅 메시지를 검증된 가치 제안에 맞춰 조정하세요"
            ]
        elif status == "invalidated":
            return [
                "가격 정책을 재검토하고 세분화된 가격 모델을 고려하세요",
                "고객 세그먼트를 다시 정의하고 타겟을 조정하세요",
                "가치 제안을 명확히 하고 차별화 포인트를 강화하세요"
            ]
        else:
            return [
                "추가적인 고객 인터뷰를 통해 더 많은 데이터를 수집하세요",
                "A/B 테스트를 통해 가설을 세분화하여 검증하세요",
                "파일럿 프로그램을 운영하여 실제 시장 반응을 확인하세요"
            ]
    
    def _generate_pivot_suggestions(self, status: str, contrary_evidence: List[str]) -> List[str]:
        """피벗 제안 생성"""
        
        if status == "invalidated":
            return [
                "B2C에서 B2B로 비즈니스 모델 전환 검토",
                "프리미엄 모델에서 프리미엄 + 광고 모델로 전환",
                "제품 중심에서 서비스 중심으로 전환",
                "단일 제품에서 플랫폼 모델로 확장"
            ]
        elif status == "partial":
            return [
                "특정 고객 세그먼트에 집중하는 니치 전략 고려",
                "가격 정책을 티어별로 세분화",
                "핵심 기능을 재정의하고 불필요한 기능 제거",
                "파트너십을 통한 가치 제안 강화"
            ]
        else:
            return []
    
    def run_financial_simulation(self, months: int = 12) -> Dict[str, Any]:
        """재무 시뮬레이션 실행"""
        
        # 초기 파라미터 설정
        initial_users = 10
        monthly_growth_rate = 0.15  # 15% 성장률
        churn_rate = 0.05  # 5% 이탈률
        conversion_rate = 0.1  # 10% 전환율
        arpu = 9900  # 평균 고객당 수익
        
        # 비용 구조
        fixed_costs = 10000000  # 고정비 1천만원
        variable_cost_per_user = 1000  # 사용자당 변동비
        marketing_cost = 5000000  # 마케팅 비용
        
        results = {
            "months": [],
            "users": [],
            "revenue": [],
            "costs": [],
            "profit": [],
            "cumulative_profit": []
        }
        
        cumulative_profit = 0
        current_users = initial_users
        
        for month in range(1, months + 1):
            # 사용자 성장
            new_users = int(current_users * monthly_growth_rate)
            churned_users = int(current_users * churn_rate)
            current_users = current_users + new_users - churned_users
            
            # 수익 계산
            paying_users = int(current_users * conversion_rate)
            monthly_revenue = paying_users * arpu
            
            # 비용 계산
            monthly_costs = fixed_costs + (current_users * variable_cost_per_user) + marketing_cost
            
            # 이익 계산
            monthly_profit = monthly_revenue - monthly_costs
            cumulative_profit += monthly_profit
            
            # 결과 저장
            results["months"].append(f"Month {month}")
            results["users"].append(current_users)
            results["revenue"].append(monthly_revenue)
            results["costs"].append(monthly_costs)
            results["profit"].append(monthly_profit)
            results["cumulative_profit"].append(cumulative_profit)
        
        # 주요 지표 계산
        results["metrics"] = {
            "break_even_month": next((i + 1 for i, p in enumerate(results["cumulative_profit"]) if p > 0), None),
            "total_users": current_users,
            "total_revenue": sum(results["revenue"]),
            "total_costs": sum(results["costs"]),
            "roi": (sum(results["revenue"]) - sum(results["costs"])) / sum(results["costs"]) * 100,
            "cac": marketing_cost / (new_users if new_users > 0 else 1),  # 고객 획득 비용
            "ltv": arpu * 12 / (churn_rate if churn_rate > 0 else 0.01),  # 고객 생애 가치
        }
        
        return results

# FastAPI 연동을 위한 API 래퍼
class SimulationAPI:
    """FastAPI와 연동하기 위한 API 래퍼"""
    
    @staticmethod
    def create_simulation(bmc_data: Dict) -> Dict[str, Any]:
        """시뮬레이션 생성 및 실행"""
        
        engine = SimulationEngine(bmc_data)
        
        # 1. 페르소나 생성
        personas = engine.generate_personas(count=20)
        
        # 2. 인터뷰 수행
        interview_questions = [
            "현재 어떤 문제를 겪고 계신가요?",
            "우리 제품의 가치 제안에 대해 어떻게 생각하시나요?",
            "월 9,900원의 구독료를 지불할 의향이 있으신가요?",
            "어떤 기능이 가장 중요하다고 생각하시나요?",
            "어떤 채널을 통해 제품을 알고 싶으신가요?"
        ]
        
        for persona in personas:
            engine.conduct_interviews(persona, interview_questions)
        
        # 3. 가설 검증
        hypotheses = bmc_data.get("hypotheses", [])
        validation_results = []
        
        for hypothesis in hypotheses:
            result = engine.validate_hypothesis(hypothesis)
            validation_results.append(asdict(result))
        
        # 4. 재무 시뮬레이션
        financial_results = engine.run_financial_simulation(months=12)
        
        # 5. 결과 종합
        return {
            "simulation_id": f"sim_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "timestamp": datetime.now().isoformat(),
            "personas": [asdict(p) for p in personas],
            "interview_results": {
                persona_id: [asdict(r) for r in responses]
                for persona_id, responses in engine.interview_results.items()
            },
            "validation_results": validation_results,
            "financial_projection": financial_results,
            "market_analysis": engine.market_data,
            "summary": {
                "total_personas": len(personas),
                "total_interviews": len(personas) * len(interview_questions),
                "validated_hypotheses": sum(1 for r in validation_results if r["validation_status"] == "validated"),
                "invalidated_hypotheses": sum(1 for r in validation_results if r["validation_status"] == "invalidated"),
                "break_even_month": financial_results["metrics"].get("break_even_month"),
                "projected_roi": financial_results["metrics"].get("roi")
            }
        }

if __name__ == "__main__":
    # 테스트 실행
    test_bmc = {
        "value_proposition": "통합 업무 관리 솔루션",
        "customer_segments": ["스타트업", "중소기업", "프리랜서"],
        "hypotheses": [
            "20대 고객의 70%가 우리 앱을 유료로 사용할 것이다",
            "월 구독료 9,900원은 적정 가격이다",
            "소셜 미디어를 통한 마케팅이 가장 효과적일 것이다"
        ]
    }
    
    result = SimulationAPI.create_simulation(test_bmc)
    print(json.dumps(result["summary"], indent=2, ensure_ascii=False))
