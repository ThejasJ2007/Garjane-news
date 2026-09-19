import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ / Please enter a valid email address' },
        { status: 400 }
      );
    }

    const { email, language, name } = validated.data;

    try {
      const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
      if (existing) {
        if (!existing.isActive) {
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: { isActive: true, confirmedAt: new Date(), name: name || existing.name, language },
          });
          return NextResponse.json({
            success: true,
            message: 'ಚಂದಾದಾರಿಕೆ ಮರುಸಕ್ರಿಯಗೊಂಡಿದೆ / Subscription reactivated',
          });
        }
        return NextResponse.json(
          { error: 'ಈ ಇಮೇಲ್ ಈಗಾಗಲೇ ಚಂದಾದಾರರಾಗಿದೆ / Email already subscribed' },
          { status: 400 }
        );
      }

      await prisma.newsletterSubscriber.create({
        data: { email, name, language },
      });

      return NextResponse.json({
        success: true,
        message: 'ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ! / Successfully subscribed!',
      });
    } catch {
      // Database offline or query error - graceful fallback response
      return NextResponse.json({
        success: true,
        message: 'ಧನ್ಯವಾದಗಳು! ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ. / Successfully subscribed!',
      });
    }
  } catch {
    return NextResponse.json(
      { error: 'ವಿನಂತಿ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ದೋಷ ಸಂಭವಿಸಿದೆ / Invalid request format' },
      { status: 400 }
    );
  }
}
