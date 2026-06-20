import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ── Arabic marketing templates (free, no LLM credits) ──
// Each template receives an object with beneficiary fields and uses
// {{placeholders}} that get replaced at runtime.

const TEMPLATES = {
  مادي: [
    `🕌 *فرصة عظيمة للصدقة الجارية* 🕌

أسرة كريمة مكونة من {{dependents_count}} أفراد تعاني من ضائقة مالية شديدة. دخلها الشهري لا يتجاوز {{total_income}} ريال، مما يجعلها غير قادرة على توفير أساسيات الحياة الكريمة.

قال ﷺ: "ما من يوم يصبح العباد فيه إلا ملكان ينزلان، فيقول أحدهما: اللهم أعط منفقاً خلفاً".

🟢 *ساهم الآن* وكن سبباً في تفريج كربة هذه الأسرة.
{{donation_link}}`,

    `💚 *يداً واحدة... لنصنع الفرق* 💚

تخيّل أسرة {{dependents_count}} أشخاص، دخلها {{total_income}} ريال فقط، تعيش في {{city}} وتكافح يومياً لتأمين لقمة العيش. {{housing_context}}

قال تعالى: "وَمَا تُنفِقُوا مِنْ خَيْرٍ فَلِأَنفُسِكُمْ".

🤲 *تبرعك* قد يكون باب رزق لهذه الأسرة.
{{donation_link}}`,

    `🤲 *حاجة ملحّة... وقلب رحيم* 🤲

أسرة من {{dependents_count}} أفراد في {{city}}، تواجه تحديات مالية خانقة. دخلها {{total_income}} ريال وهو بالكاد يغطي {{expense_context}}.

فرصة ذهبية للصدقة 🤍

🟢 *لا تتردد... تبرعك يُحدث فرقاً حقيقياً.*
{{donation_link}}`
  ],

  صحي: [
    `🏥 *أنقذ حياة... بصدقتك* 🏥

حالة إنسانية مؤثرة في {{city}}: أسرة مكونة من {{dependents_count}} أفراد، أحدهم يعاني من {{sickness_type}}. الظروف المالية ({{total_income}} ريال شهرياً) تجعل العلاج بعيد المنال.

قال ﷺ: "من نفس عن مؤمن كربة من كرب الدنيا، نفس الله عنه كربة من كرب يوم القيامة".

💊 *تبرعك* = أمل وعلاج وحياة كريمة.
{{donation_link}}`,

    `💚 *صحتهم... أمانة في أعناقنا* 💚

في {{city}}، أسرة {{dependents_count}} أفراد تحتاج علاجاً عاجلاً لـ {{sickness_type}}. دخل الأسرة {{total_income}} ريال فقط لا يكفي أبسط المتطلبات الطبية.

"وَمَنْ أَحْيَاهَا فَكَأَنَّمَا أَحْيَا النَّاسَ جَمِيعًا" 🤍

🩺 *كن سبباً في شفائهم... تبرع الآن.*
{{donation_link}}`,

    `🤲 *يد العون... تشفي القلوب* 🤲

حالة صحية عاجلة في {{city}}. أسرة {{dependments_count}} أفراد تعاني {{health_context}}. {{income_context}}

💚 تبرعك = دواء + أمل + حياة.
{{donation_link}}`
  ],

  تعليمي: [
    `📚 *علمٌ يبني مستقبلاً* 📚

أسرة كريمة في {{city}} لديها {{dependents_count}} أفراد في سن الدراسة. رغم الظروف المالية الصعبة ({{total_income}} ريال شهرياً)، إلا أن طموحهم لا يعرف المستحيل.

قال ﷺ: "من سلك طريقاً يلتمس فيه علماً، سهل الله له طريقاً إلى الجنة".

🎓 *ساهم في تعليمهم... واكسب الأجر.*
{{donation_link}}`,

    `🎒 *التعليم... حق لكل طفل* 🎒

في {{city}}، {{dependents_count}} طلاب بحاجة لدعم تعليمي. {{income_context}} والظروف المعيشية تهدد مستقبلهم الدراسي.

"هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ" 📖

💡 *بتبرعك... تضيء مستقبل طالب.*
{{donation_link}}`
  ],

  اجتماعي: [
    `🏠 *بيت آمن... وقلب مطمئن* 🏠

أسرة مكونة من {{dependents_count}} أفراد في {{city}}، تعاني من {{social_context}} وظروف {{housing_type}} غير مناسبة. {{income_context}}

قال تعالى: "وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ" 🤍

🟢 *كن محسناً... تبرعك يغير حياتهم.*
{{donation_link}}`,

    `🤲 *معاً... نحو حياة كريمة* 🤲

حالة اجتماعية في {{city}} تحتاج تدخلاً عاجلاً. أسرة {{dependents_count}} أفراد تعيش {{housing_context}} في ظروف صعبة.

💚 *ساهم ولو بالقليل... فالقليل عند الله كثير.*
{{donation_link}}`
  ],

  متعدد: [
    `🕌 *حالة إنسانية متكاملة* 🕌

أسرة {{dependents_count}} أفراد في {{city}} تواجه تحديات متعددة: {{challenges_summary}}. دخلها {{total_income}} ريال لا يكفي احتياجاتها الأساسية.

قال ﷺ: "المسلم أخو المسلم، لا يظلمه ولا يسلمه".

🤲 *بادر بالخير... تبرعك شامل لكل احتياجاتهم.*
{{donation_link}}`,

    `💚 *يد العون الشاملة* 💚

في {{city}}، أسرة {{dependents_count}} أفراد بحاجة لدعم متكامل يشمل {{challenges_summary}}. {{income_context}}

"وَمَا تُقَدِّمُوا لِأَنفُسِكُم مِّنْ خَيْرٍ تَجِدُوهُ عِندَ اللَّهِ" 🤍

🟢 *تبرعك يشمل كل جوانب حياتهم... ساهم الآن.*
{{donation_link}}`
  ]
};

// Fallback generic template
const FALLBACK_TEMPLATE = `🤲 *حالة إنسانية تحتاج كرمكم* 🤲

أسرة مكونة من {{dependents_count}} أفراد في {{city}} بحاجة ماسة لدعمكم. ظروفهم المعيشية تستدعي تدخلاً عاجلاً.

💚 *تبرعك... أمل جديد لحياتهم.*
{{donation_link}}`;

/**
 * Pick a random template for the given case_type, or fallback.
 */
function pickTemplate(caseType, dependentsCount, totalIncome, city, housingType, sicknessType) {
  const FORMATTED_HOUSING = { شعبي: 'مسكن شعبي متواضع', شقة: 'شقة صغيرة', فيلا: 'فيلا', ملحق: 'ملحق' };
  const housingContext = housingType ? `تسكن في ${FORMATTED_HOUSING[housingType] || 'مسكن متواضع'}` : 'ظروف سكنها متواضعة';

  const typeTemplates = TEMPLATES[caseType] || TEMPLATES['متعدد'];
  const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];

  return {
    template,
    housingContext,
  };
}

/**
 * Build a rich context string summarizing challenges for the "متعدد" template.
 */
function buildChallengesSummary(b) {
  const parts = [];
  if (b.health_status === 'مريض' && b.sickness_type) parts.push(`حالة ${b.sickness_type}`);
  if (b.health_status === 'معاق' && b.disability_type) parts.push(`إعاقة (${b.disability_type})`);
  if ((b.total_income || 0) < 2000) parts.push('دخل منخفض جداً');
  if (b.housing_tenure === 'إيجار') parts.push('إيجار');
  if (b.debt_reason) parts.push('ديون متراكمة');
  return parts.length > 0 ? parts.join('، ') : 'ظروف معيشية صعبة';
}

/**
 * Build expense context string.
 */
function buildExpenseContext(b) {
  const exp = [];
  if (b.expense_rent) exp.push(`الإيجار`);
  if (b.expense_medical) exp.push(`العلاج`);
  return exp.length > 0 ? exp.join(' و') : 'الضروريات الأساسية';
}

/**
 * Build income context string.
 */
function buildIncomeContext(b) {
  const income = b.total_income || 0;
  if (income === 0) return 'لا يوجد دخل ثابت للأسرة';
  return `دخلها ${income} ريال فقط`;
}

/**
 * Build social context string.
 */
function buildSocialContext(b) {
  if (b.social_status === 'أرمل') return 'فقدان المعيل';
  if (b.social_status === 'مطلقة' || b.social_status === 'مطلق') return 'انفصال أسري';
  if (b.social_status === 'مهجور') return 'هجران المعيل';
  return 'ظروف اجتماعية صعبة';
}

/**
 * Fill in template placeholders with real data.
 */
function fillTemplate(template, b) {
  const income = b.total_income || 0;
  const incomeDisplay = income === 0 ? 'لا يوجد' : income;

  return template
    .replace(/\{\{dependents_count\}\}/g, String(b.dependents_count || 'عدة'))
    .replace(/\{\{total_income\}\}/g, String(incomeDisplay))
    .replace(/\{\{city\}\}/g, b.city || 'إحدى المدن')
    .replace(/\{\{sickness_type\}\}/g, b.sickness_type || 'مرض مزمن')
    .replace(/\{\{housing_context\}\}/g, b.housing_type
      ? `تسكن في ${({ شعبي: 'مسكن شعبي متواضع', شقة: 'شقة صغيرة', فيلا: 'فيلا', ملحق: 'ملحق' })[b.housing_type] || 'مسكن متواضع'}`
      : 'ظروف سكنها متواضعة')
    .replace(/\{\{expense_context\}\}/g, buildExpenseContext(b))
    .replace(/\{\{income_context\}\}/g, buildIncomeContext(b))
    .replace(/\{\{health_context\}\}/g, b.health_status === 'مريض' ? `من ${b.sickness_type || 'مشكلة صحية'}` : 'مشاكل صحية')
    .replace(/\{\{social_context\}\}/g, buildSocialContext(b))
    .replace(/\{\{challenges_summary\}\}/g, buildChallengesSummary(b))
    .replace(/\{\{donation_link\}\}/g, '[رابط التبرع]');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'غير مصرح' }, { status: 401 });
    }

    // Only marketers, ngo_managers, and platform_admins can generate marketing kits
    if (!['marketer', 'ngo_manager', 'platform_admin'].includes(user.role)) {
      return Response.json({ error: 'غير مصرح لك بهذا الإجراء' }, { status: 403 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: 'يرجى إرسال beneficiary_id' }, { status: 400 });
    }

    const { beneficiary_id } = body;
    if (!beneficiary_id) {
      return Response.json({ error: 'يرجى إرسال beneficiary_id' }, { status: 400 });
    }

    // Fetch beneficiary (asServiceRole to bypass RLS for cross-role access —
    // we already validated the caller's permissions above)
    const beneficiary = await base44.asServiceRole.entities.Beneficiary.get(beneficiary_id);
    if (!beneficiary) {
      return Response.json({ error: 'المستفيد غير موجود' }, { status: 404 });
    }

    // Verify marketer belongs to same NGO
    if (user.role === 'marketer' && user.data?.ngo_id && beneficiary.ngo_id !== user.data.ngo_id) {
      return Response.json({ error: 'غير مصرح - مستفيد من منظمة أخرى' }, { status: 403 });
    }

    // Pick and fill template
    const { template } = pickTemplate(
      beneficiary.case_type,
      beneficiary.dependents_count,
      beneficiary.total_income,
      beneficiary.city,
      beneficiary.housing_type,
      beneficiary.sickness_type
    );

    const story = fillTemplate(template, beneficiary);

    // Save to beneficiary
    await base44.asServiceRole.entities.Beneficiary.update(beneficiary_id, { marketing_story: story });

    return Response.json({
      success: true,
      beneficiary_id,
      marketing_story: story,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'حدث خطأ غير متوقع' }, { status: 500 });
  }
});