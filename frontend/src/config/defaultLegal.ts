import type { SiteLegal } from '@/types/content'

/** Contenu juridique par défaut — aligné sur backend/src/services/defaultLegal.ts */
export function defaultLegalContent(): SiteLegal {
  return {
    terms: `<h2>1. Objet</h2>
<p>Les présentes conditions générales d'utilisation (ci-après « CGU ») régissent l'accès et l'utilisation du site internet de <strong>D.O.G. Dépann' Ordi Game</strong> (ci-après « le Site »). Le Site a pour vocation de présenter les prestations de dépannage informatique, montage PC, optimisation et réparation matérielle proposées par D.O.G., ainsi que de permettre aux visiteurs de prendre contact.</p>
<p>L'accès au Site implique l'acceptation pleine et entière des présentes CGU.</p>

<h2>2. Éditeur du Site</h2>
<p>Le Site est édité par <strong>D.O.G. Dépann' Ordi Game</strong>, situé au 12 rue de la République, 69000 Lyon, France.</p>
<p>Contact : <a href="mailto:contact@dog-informatique.fr">contact@dog-informatique.fr</a> — Téléphone : 06 00 00 00 00</p>

<h2>3. Services présentés</h2>
<p>Le Site présente notamment les prestations suivantes :</p>
<ul>
<li>Réparation et diagnostic matériel (GPU, composants PC) ;</li>
<li>Montage et configuration de stations gaming sur mesure ;</li>
<li>Refroidissement liquide (watercooling) ;</li>
<li>Overclocking et optimisation logicielle ;</li>
<li>Conseils techniques via formulaire de contact et newsletter.</li>
</ul>
<p>Les informations affichées sur le Site sont données à titre indicatif et peuvent être modifiées à tout moment sans préavis.</p>

<h2>4. Accès au Site</h2>
<p>D.O.G. s'efforce d'assurer un accès continu au Site. Toutefois, l'accès peut être interrompu pour maintenance, mise à jour ou en cas de force majeure, sans que la responsabilité de D.O.G. ne puisse être engagée.</p>

<h2>5. Formulaire de contact</h2>
<p>Le formulaire de contact permet d'adresser une demande d'information ou de devis. L'utilisateur s'engage à fournir des informations exactes et à ne pas transmettre de contenus illicites, offensants ou portant atteinte aux droits de tiers.</p>
<p>D.O.G. se réserve le droit de ne pas répondre aux demandes manifestement abusives ou sans lien avec son activité.</p>

<h2>6. Responsabilité</h2>
<p>D.O.G. met tout en œuvre pour fournir des informations fiables. Toutefois :</p>
<ul>
<li>Les conseils techniques diffusés sur le Site ou les réseaux sociaux ne remplacent pas un diagnostic sur place ;</li>
<li>Les résultats de performance (FPS, températures, overclocking) dépendent du matériel, de l'usage et de l'environnement ;</li>
<li>D.O.G. ne saurait être tenue responsable des dommages indirects liés à l'utilisation des informations du Site.</li>
</ul>
<p>Pour toute intervention sur votre matériel, un devis et des conditions spécifiques pourront vous être proposés en dehors du cadre des présentes CGU.</p>

<h2>7. Propriété intellectuelle</h2>
<p>L'ensemble des éléments du Site (textes, visuels, logos, mise en page, portfolio, vidéos liées) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou exploitation non autorisée est interdite.</p>

<h2>8. Liens externes</h2>
<p>Le Site peut contenir des liens vers des plateformes tierces (YouTube, TikTok, etc.). D.O.G. n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.</p>

<h2>9. Données personnelles</h2>
<p>Le traitement des données personnelles collectées via le Site est décrit dans la <a href="/politique-de-confidentialite">Politique de confidentialité</a>.</p>

<h2>10. Droit applicable et litiges</h2>
<p>Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents du ressort de Lyon seront seuls compétents.</p>

<p><em>Dernière mise à jour : juillet 2026</em></p>`,

    privacy: `<h2>1. Responsable du traitement</h2>
<p>Le responsable du traitement des données personnelles est <strong>D.O.G. Dépann' Ordi Game</strong>, 12 rue de la République, 69000 Lyon, France.</p>
<p>Contact données personnelles : <a href="mailto:contact@dog-informatique.fr">contact@dog-informatique.fr</a></p>

<h2>2. Données collectées</h2>
<p>Nous collectons uniquement les données que vous nous transmettez volontairement :</p>
<ul>
<li><strong>Formulaire de contact</strong> : nom ou pseudo, adresse e-mail, numéro de téléphone (optionnel), type de mission, message ;</li>
<li><strong>Newsletter</strong> : adresse e-mail ;</li>
<li><strong>Espace d'administration</strong> : identifiants de connexion (gérés localement, non accessibles au public).</li>
</ul>
<p>Nous ne collectons pas de données sensibles au sens du RGPD.</p>

<h2>3. Finalités et bases légales</h2>
<ul>
<li><strong>Réponse à vos demandes</strong> (contact, devis, support) — exécution de mesures précontractuelles ou intérêt légitime ;</li>
<li><strong>Newsletter et alertes</strong> — consentement ou intérêt légitime selon le contexte de l'inscription ;</li>
<li><strong>Sécurité et fonctionnement du Site</strong> — intérêt légitime.</li>
</ul>

<h2>4. Destinataires et sous-traitants</h2>
<p>Vos données sont accessibles uniquement aux personnes habilitées de D.O.G. Elles peuvent être traitées par :</p>
<ul>
<li>Notre hébergeur (serveur du Site) ;</li>
<li>Notre service d'envoi d'e-mails (SMTP, ex. Gmail) pour la transmission des messages de contact.</li>
</ul>
<p>Ces prestataires agissent sur instruction de D.O.G. et dans le cadre contractuel requis par le RGPD.</p>

<h2>5. Durée de conservation</h2>
<ul>
<li>Messages de contact : jusqu'à <strong>3 ans</strong> après le dernier échange ;</li>
<li>Inscriptions newsletter : jusqu'à <strong>3 ans</strong> après la dernière interaction ou jusqu'au désabonnement ;</li>
<li>Données d'administration : pendant la durée d'utilisation du service.</li>
</ul>

<h2>6. Vos droits</h2>
<p>Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, limitation, opposition et portabilité (lorsque applicable).</p>
<p>Pour exercer vos droits, contactez-nous à <a href="mailto:contact@dog-informatique.fr">contact@dog-informatique.fr</a>. Une réponse vous sera apportée dans un délai d'un mois.</p>
<p>Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" rel="noopener noreferrer" target="_blank">www.cnil.fr</a>).</p>

<h2>7. Cookies et traceurs</h2>
<p>Le Site public ne dépose pas de cookies publicitaires ou de mesure d'audience tiers à ce jour. Des cookies techniques peuvent être utilisés pour le bon fonctionnement de l'espace d'administration (session). Vous pouvez configurer votre navigateur pour refuser les cookies.</p>

<h2>8. Sécurité</h2>
<p>D.O.G. met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la perte ou l'altération.</p>

<h2>9. Modifications</h2>
<p>Cette politique peut être mise à jour. La date de dernière mise à jour figure en bas de page. Nous vous invitons à la consulter régulièrement.</p>

<p><em>Dernière mise à jour : juillet 2026</em></p>`,
  }
}
