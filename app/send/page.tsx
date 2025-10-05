'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface FormData {
  // Expéditeur
  senderName: string
  senderPhone: string
  senderEmail: string
  senderAddress: string
  senderPostalCode: string
  senderCity: string
  senderCountry: 'maroc' | 'allemagne' | ''

  // Destinataire
  receiverName: string
  receiverPhone: string
  receiverEmail: string
  receiverAddress: string
  receiverPostalCode: string
  receiverCity: string
  receiverCountry: 'maroc' | 'allemagne' | ''

  // Colis
  contentType: string
  description: string
  weight: string
  length: string
  width: string
  height: string
  declaredValue: string
  packageCount: string

  // Options
  serviceType: 'standard' | 'express'
  deliveryMode: 'domicile' | 'point-relais'
  insurance: 'basic' | '500' | '1000'
  paymentMode: 'cash' | 'card' | 'online'

  // Supplémentaire
  deliveryInstructions: string
  preferredTime: string
  comments: string
}

export default function SendPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    senderName: '', senderPhone: '', senderEmail: '', senderAddress: '', senderPostalCode: '', senderCity: '', senderCountry: '',
    receiverName: '', receiverPhone: '', receiverEmail: '', receiverAddress: '', receiverPostalCode: '', receiverCity: '', receiverCountry: '',
    contentType: '', description: '', weight: '', length: '', width: '', height: '', declaredValue: '', packageCount: '1',
    serviceType: 'standard', deliveryMode: 'domicile', insurance: 'basic', paymentMode: 'cash',
    deliveryInstructions: '', preferredTime: '', comments: ''
  })
  
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  const steps = [
    { number: 1, title: 'Expéditeur', icon: '👤' },
    { number: 2, title: 'Destinataire', icon: '🎯' },
    { number: 3, title: 'Colis', icon: '📦' },
    { number: 4, title: 'Options', icon: '🚚' },
    { number: 5, title: 'Paiement', icon: '💳' },
    { number: 6, title: 'Récapitulatif', icon: '📋' }
  ]

  const contentTypes = [
    'Vêtements et textiles',
    'Électronique',
    'Documents et papiers',
    'Produits alimentaires',
    'Cosmétiques et soins',
    'Livres et média',
    'Artisanat et souvenirs',
    'Autre'
  ]

  const calculatePrice = () => {
    const weight = parseFloat(formData.weight) || 0
    const basePrice = weight * 8 // 8€ par kg
    const serviceMultiplier = formData.serviceType === 'express' ? 1.5 : 1
    const insurancePrice = formData.insurance === '500' ? 5 : formData.insurance === '1000' ? 10 : 0
    return Math.round((basePrice * serviceMultiplier + insurancePrice) * 100) / 100
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    // Recalculer le prix si nécessaire
    if (['weight', 'serviceType', 'insurance'].includes(field)) {
      setEstimatedPrice(calculatePrice())
    }
  }

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    alert('Votre demande d\'envoi a été enregistrée ! Nous vous contacterons sous 24h pour finaliser.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-2xl font-bold text-secondary">LivPro</span>
            </Link>
            <Link 
              href="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Stepper */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-secondary mb-6">Étapes</h2>
              <div className="space-y-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      currentStep === step.number
                        ? 'bg-primary text-white'
                        : currentStep > step.number
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                    <div>
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-75">Étape {step.number}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prix estimé */}
              {formData.weight && (
                <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                  <h3 className="font-semibold text-secondary mb-2">Prix estimé</h3>
                  <div className="text-2xl font-bold text-primary">
                    {calculatePrice()}€
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.serviceType === 'express' ? 'Service Express' : 'Service Standard'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {currentStep === 1 && (
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-6">👤 Informations de l'expéditeur</h1>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.senderName}
                        onChange={(e) => updateFormData('senderName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Votre nom et prénom"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        value={formData.senderPhone}
                        onChange={(e) => updateFormData('senderPhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+212 6XX XXX XXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.senderEmail}
                        onChange={(e) => updateFormData('senderEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="votre@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                      <select
                        value={formData.senderCountry}
                        onChange={(e) => updateFormData('senderCountry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez un pays</option>
                        <option value="maroc">🇲🇦 Maroc</option>
                        <option value="allemagne">🇩🇪 Allemagne</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                      <input
                        type="text"
                        value={formData.senderAddress}
                        onChange={(e) => updateFormData('senderAddress', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Numéro, rue, quartier..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                      <input
                        type="text"
                        value={formData.senderPostalCode}
                        onChange={(e) => updateFormData('senderPostalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="20000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        value={formData.senderCity}
                        onChange={(e) => updateFormData('senderCity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Casablanca"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-6">🎯 Informations du destinataire</h1>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                      <input
                        type="text"
                        value={formData.receiverName}
                        onChange={(e) => updateFormData('receiverName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Nom du destinataire"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        value={formData.receiverPhone}
                        onChange={(e) => updateFormData('receiverPhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+49 XXX XXX XXXX"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.receiverEmail}
                        onChange={(e) => updateFormData('receiverEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="email@destinataire.com (optionnel)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                      <select
                        value={formData.receiverCountry}
                        onChange={(e) => updateFormData('receiverCountry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez un pays</option>
                        <option value="maroc">🇲🇦 Maroc</option>
                        <option value="allemagne">🇩🇪 Allemagne</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse complète *</label>
                      <input
                        type="text"
                        value={formData.receiverAddress}
                        onChange={(e) => updateFormData('receiverAddress', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Adresse de livraison"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                      <input
                        type="text"
                        value={formData.receiverPostalCode}
                        onChange={(e) => updateFormData('receiverPostalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="10115"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                      <input
                        type="text"
                        value={formData.receiverCity}
                        onChange={(e) => updateFormData('receiverCity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Berlin"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-6">📦 Détails de votre colis</h1>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type de contenu *</label>
                      <select
                        value={formData.contentType}
                        onChange={(e) => updateFormData('contentType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Sélectionnez le type</option>
                        {contentTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de colis *</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.packageCount}
                        onChange={(e) => updateFormData('packageCount', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description détaillée *</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Décrivez précisément le contenu de votre colis..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Poids total (kg) *</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="30"
                        value={formData.weight}
                        onChange={(e) => updateFormData('weight', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="2.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Valeur déclarée (€) *</label>
                      <input
                        type="number"
                        min="1"
                        value={formData.declaredValue}
                        onChange={(e) => updateFormData('declaredValue', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="150"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Longueur (cm)</label>
                      <input
                        type="number"
                        value={formData.length}
                        onChange={(e) => updateFormData('length', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Largeur (cm)</label>
                      <input
                        type="number"
                        value={formData.width}
                        onChange={(e) => updateFormData('width', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hauteur (cm)</label>
                      <input
                        type="number"
                        value={formData.height}
                        onChange={(e) => updateFormData('height', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-6">🚚 Options de livraison</h1>
                  <div className="space-y-8">
                    {/* Type de service */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Type de service</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.serviceType === 'standard' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="serviceType"
                            value="standard"
                            checked={formData.serviceType === 'standard'}
                            onChange={(e) => updateFormData('serviceType', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">Standard</div>
                              <div className="text-sm text-gray-600">5-7 jours ouvrés</div>
                            </div>
                            <div className="text-lg font-bold text-primary">Inclus</div>
                          </div>
                        </label>
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.serviceType === 'express' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="serviceType"
                            value="express"
                            checked={formData.serviceType === 'express'}
                            onChange={(e) => updateFormData('serviceType', e.target.value)}
                            className="sr-only"
                          />
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold">Express</div>
                              <div className="text-sm text-gray-600">2-3 jours ouvrés</div>
                            </div>
                            <div className="text-lg font-bold text-primary">+50%</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Mode de livraison */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Mode de livraison</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.deliveryMode === 'domicile' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="deliveryMode"
                            value="domicile"
                            checked={formData.deliveryMode === 'domicile'}
                            onChange={(e) => updateFormData('deliveryMode', e.target.value)}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-semibold">À domicile</div>
                            <div className="text-sm text-gray-600">Livraison directement chez le destinataire</div>
                          </div>
                        </label>
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.deliveryMode === 'point-relais' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="deliveryMode"
                            value="point-relais"
                            checked={formData.deliveryMode === 'point-relais'}
                            onChange={(e) => updateFormData('deliveryMode', e.target.value)}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-semibold">Point relais</div>
                            <div className="text-sm text-gray-600">Retrait dans un point de collecte</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Assurance */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Assurance complémentaire</h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.insurance === 'basic' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="insurance"
                            value="basic"
                            checked={formData.insurance === 'basic'}
                            onChange={(e) => updateFormData('insurance', e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-semibold">Basique</div>
                            <div className="text-sm text-gray-600">Jusqu'à 100€</div>
                            <div className="text-lg font-bold text-primary mt-2">Incluse</div>
                          </div>
                        </label>
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.insurance === '500' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="insurance"
                            value="500"
                            checked={formData.insurance === '500'}
                            onChange={(e) => updateFormData('insurance', e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-semibold">Renforcée</div>
                            <div className="text-sm text-gray-600">Jusqu'à 500€</div>
                            <div className="text-lg font-bold text-primary mt-2">+5€</div>
                          </div>
                        </label>
                        <label className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.insurance === '1000' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}>
                          <input
                            type="radio"
                            name="insurance"
                            value="1000"
                            checked={formData.insurance === '1000'}
                            onChange={(e) => updateFormData('insurance', e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-semibold">Premium</div>
                            <div className="text-sm text-gray-600">Jusqu'à 1000€</div>
                            <div className="text-lg font-bold text-primary mt-2">+10€</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-6">💳 Mode de paiement</h1>
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <label className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMode === 'cash' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cash"
                        checked={formData.paymentMode === 'cash'}
                        onChange={(e) => updateFormData('paymentMode', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-3">💵</div>
                        <div className="font-semibold">Espèces</div>
                        <div className="text-sm text-gray-600 mt-2">Paiement à la livraison en liquide</div>
                      </div>
                    </label>
                    <label className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMode === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMode"
                        value="card"
                        checked={formData.paymentMode === 'card'}
                        onChange={(e) => updateFormData('paymentMode', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-3">💳</div>
                        <div className="font-semibold">Carte bancaire</div>
                        <div className="text-sm text-gray-600 mt-2">Paiement à la livraison par carte</div>
                      </div>
                    </label>
                    <label className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.paymentMode === 'online' ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <input
                        type="radio"
                        name="paymentMode"
                        value="online"
                        checked={formData.paymentMode === 'online'}
                        onChange={(e) => updateFormData('paymentMode', e.target.value)}
                        className="sr-only"
                      />
                      <div className="text-center">
                        <div className="text-3xl mb-3">🌐</div>
                        <div className="font-semibold">Paiement en ligne</div>
                        <div className="text-sm text-gray-600 mt-2">Stripe, PayPal, virement</div>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instructions de livraison</label>
                      <textarea
                        value={formData.deliveryInstructions}
                        onChange={(e) => updateFormData('deliveryInstructions', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Code d'accès, étage, instructions spéciales..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Créneaux de livraison préférés</label>
                      <input
                        type="text"
                        value={formData.preferredTime}
                        onChange={(e) => updateFormData('preferredTime', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Ex: Matin (9h-12h), Après-midi (14h-18h)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Commentaires</label>
                      <textarea
                        value={formData.comments}
                        onChange={(e) => updateFormData('comments', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Autres informations importantes..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div>
                  <h1 className="text-3xl font-bold text-secondary mb-6">📋 Récapitulatif de votre envoi</h1>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {/* Expéditeur */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          👤 Expéditeur
                        </h3>
                        <div className="text-sm space-y-1">
                          <div><strong>{formData.senderName}</strong></div>
                          <div>{formData.senderPhone}</div>
                          <div>{formData.senderEmail}</div>
                          <div>{formData.senderAddress}</div>
                          <div>{formData.senderPostalCode} {formData.senderCity}</div>
                          <div>{formData.senderCountry === 'maroc' ? '🇲🇦 Maroc' : '🇩🇪 Allemagne'}</div>
                        </div>
                      </div>

                      {/* Destinataire */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          🎯 Destinataire
                        </h3>
                        <div className="text-sm space-y-1">
                          <div><strong>{formData.receiverName}</strong></div>
                          <div>{formData.receiverPhone}</div>
                          {formData.receiverEmail && <div>{formData.receiverEmail}</div>}
                          <div>{formData.receiverAddress}</div>
                          <div>{formData.receiverPostalCode} {formData.receiverCity}</div>
                          <div>{formData.receiverCountry === 'maroc' ? '🇲🇦 Maroc' : '🇩🇪 Allemagne'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Colis */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          📦 Colis ({formData.packageCount} colis)
                        </h3>
                        <div className="text-sm space-y-1">
                          <div><strong>Type:</strong> {formData.contentType}</div>
                          <div><strong>Description:</strong> {formData.description}</div>
                          <div><strong>Poids:</strong> {formData.weight}kg</div>
                          <div><strong>Valeur:</strong> {formData.declaredValue}€</div>
                          {formData.length && <div><strong>Dimensions:</strong> {formData.length}×{formData.width}×{formData.height}cm</div>}
                        </div>
                      </div>

                      {/* Options */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          🚚 Options
                        </h3>
                        <div className="text-sm space-y-1">
                          <div><strong>Service:</strong> {formData.serviceType === 'express' ? 'Express (2-3j)' : 'Standard (5-7j)'}</div>
                          <div><strong>Livraison:</strong> {formData.deliveryMode === 'domicile' ? 'À domicile' : 'Point relais'}</div>
                          <div><strong>Assurance:</strong> Jusqu'à {formData.insurance === 'basic' ? '100€' : formData.insurance === '500' ? '500€' : '1000€'}</div>
                          <div><strong>Paiement:</strong> {
                            formData.paymentMode === 'cash' ? 'Espèces à la livraison' : 
                            formData.paymentMode === 'card' ? 'Carte à la livraison' : 
                            'Paiement en ligne'
                          }</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prix final */}
                  <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-secondary">Total à payer</h3>
                        <p className="text-sm text-gray-600">
                          {formData.serviceType === 'express' ? 'Service Express' : 'Service Standard'} • 
                          Assurance {formData.insurance === 'basic' ? 'basique' : formData.insurance === '500' ? 'renforcée' : 'premium'}
                        </p>
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        {calculatePrice()}€
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  ← Précédent
                </button>

                <div className="text-sm text-gray-500">
                  Étape {currentStep} sur {steps.length}
                </div>

                {currentStep < 6 ? (
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all"
                  >
                    Suivant →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                  >
                    Confirmer l'envoi ✓
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
